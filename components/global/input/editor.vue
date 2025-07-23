<script setup>
import { computed, toRef, ref, watch, nextTick, onBeforeUnmount, onMounted } from "vue";
import { useField } from "vee-validate";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import Emoji from "@tiptap/extension-emoji";
import { emojiList } from "~/utils/tiptap-emoji-list";
import { useTiptapImageUpload } from "~/composable/useTiptapImageUpload";
import { useImageResize } from "~/composable/useTiptapImageResize";

const props = defineProps({
  value: { type: String, default: "" },
  name: { type: String, required: true },
  label: { type: String, required: false },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  primary: { type: Boolean, default: false },
  isSubmitted: { type: Boolean, default: false },
});

const name = toRef(props, "name");
const root = ref(null);
const editorElement = ref(null);
const isUpdating = ref(false);
const showSpecialChars = ref(false);
const showEmojiPanel = ref(false);
const canRemoveContent = ref(false);
const showLinkModal = ref(false);
const showGdriveModal = ref(false);
const checkRemovableTimeout = ref(null);
const linkForm = ref({
  url: "",
  text: "",
  isEdit: false,
});
const gdriveForm = ref({
  url: "https://",
  hasError: false,
  errorMessage: "",
});

// Special characters data
const specialCharacters = [
  { symbol: "©", name: "Copyright" },
  { symbol: "®", name: "Registered" },
  { symbol: "™", name: "Trademark" },
  { symbol: "€", name: "Euro" },
  { symbol: "$", name: "Dollar" },
  { symbol: "£", name: "Pound" },
  { symbol: "¥", name: "Yen" },
  { symbol: "°", name: "Degree" },
  { symbol: "±", name: "Plus Minus" },
  { symbol: "÷", name: "Division" },
  { symbol: "×", name: "Multiplication" },
  { symbol: "≤", name: "Less Equal" },
  { symbol: "≥", name: "Greater Equal" },
  { symbol: "≠", name: "Not Equal" },
  { symbol: "≈", name: "Approximately" },
  { symbol: "∞", name: "Infinity" },
  { symbol: "→", name: "Right Arrow" },
  { symbol: "←", name: "Left Arrow" },
  { symbol: "↑", name: "Up Arrow" },
  { symbol: "↓", name: "Down Arrow" },
  { symbol: "…", name: "Ellipsis" },
  { symbol: "•", name: "Bullet" },
  { symbol: "†", name: "Dagger" },
  { symbol: "‡", name: "Double Dagger" },
  { symbol: "§", name: "Section" },
  { symbol: "¶", name: "Paragraph" },
  { symbol: "«", name: "Left Quote" },
  { symbol: "»", name: "Right Quote" },
  { symbol: '"', name: "Left Double Quote" },
  { symbol: '"', name: "Right Double Quote" },
  { symbol: "'", name: "Left Single Quote" },
  { symbol: "'", name: "Right Single Quote" },
  { symbol: "–", name: "En Dash" },
  { symbol: "—", name: "Em Dash" },
  { symbol: "½", name: "One Half" },
  { symbol: "¼", name: "One Quarter" },
  { symbol: "¾", name: "Three Quarters" },
  { symbol: "²", name: "Superscript 2" },
  { symbol: "³", name: "Superscript 3" },
  { symbol: "¹", name: "Superscript 1" },
];

const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(
  name
);

// Initialize with props value if provided
if (props.value && !inputValue.value) {
  handleChange(props.value);
}

// Get from Nuxt app context
const { $extractGoogleDriveFileId, $tiptapExtensions } = useNuxtApp();

// Import image upload composable
const {
  isUploading,
  uploadProgress,
  handleImageUpload,
  setupImageDropzone,
} = useTiptapImageUpload();

// Import image resize composable
const {
  setupImageResizeHandlers,
  removeFloatingToggle,
  debugIframeState,
} = useImageResize();

// Initialize Tiptap editor
const editor = useEditor({
  extensions: [
    ...($tiptapExtensions || []),
    Emoji.configure({
      // Konfigurasi emoji untuk memastikan tersimpan sebagai HTML yang benar
      HTMLAttributes: {
        class: 'emoji-content',
      },
      // Simpan emoji sebagai HTML entity atau Unicode yang aman untuk backend
      renderHTML: ({ HTMLAttributes, node }) => {
        // Encode emoji sebagai HTML entity yang lebih aman untuk backend
        const emojiChar = node.textContent;
        const encodedEmoji = emojiChar.codePointAt(0).toString(16);
        return ['span', { ...HTMLAttributes, 'data-emoji': `&#x${encodedEmoji};` }, emojiChar];
      },
    }),
  ],
  content: props.value || inputValue.value || "",
  editable: !props.readonly && !props.disabled,
  editorProps: {
    attributes: {
      class: "tiptap-editor-content",
    },
  },
  onUpdate: ({ editor }) => {
    if (isUpdating.value) return;

    console.log("Editor onUpdate triggered");

    const html = editor.getHTML();
    const normalizedHtml = html === "<p></p>" ? "" : html;

    if (normalizedHtml !== editorData.value) {
      isUpdating.value = true;
      
      // Encode emoji untuk backend compatibility sebelum kirim
      let processedHtml = normalizedHtml;
      if (normalizedHtml) {
        processedHtml = normalizedHtml.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, (match) => {
          const codePoint = match.codePointAt(0);
          return `&#x${codePoint.toString(16)};`;
        });
      }
      
      editorData.value = normalizedHtml; // Keep original for display
      
      // Kirim processed HTML ke vee-validate/backend
      handleChange(processedHtml);
      
      nextTick(() => {
        isUpdating.value = false;
      });

      // Only check removable content on actual content changes
      checkRemovableContent();
    }
  },
  onSelectionUpdate: ({ editor }) => {
    // Reduce frequency of checks on selection update to prevent table hover glitch
    checkRemovableContent();
  },
  onCreate: ({ editor }) => {
    console.log("Editor onCreate triggered");
    // Check removable content when editor is created
    setTimeout(() => {
      checkRemovableContent();
      // Setup image resize handlers
      setupImageResizeHandlers(editor);
      // Check if initial content contains Google Drive iframes
      const currentContent = editor.getHTML();
      if (
        currentContent &&
        currentContent.includes("iframe") &&
        currentContent.includes("drive.google.com")
      ) {
        // Additional setup for existing iframes
        setTimeout(() => {
          setupImageResizeHandlers(editor);
          // Debug initial iframe state
          debugIframeState(editor);
        }, 500); // Longer delay for initial content setup
      }
    }, 100);
    
    // Add listener untuk semua content changes
    editor.on('update', () => {
      const html = editor.getHTML();
    });
  },
  onTransaction: ({ editor, transaction }) => {
    // Only check on significant changes, not on every hover/selection change
    // Avoid checking during table interactions to prevent glitch
    const hasDocChanged = transaction.docChanged;
    const hasSelectionChanged = transaction.selectionSet;
    const isTableInteraction =
      transaction.getMeta("pointer") || transaction.getMeta("table");

    // Skip check if it's just a table interaction without content change
    if (isTableInteraction && !hasDocChanged) {
      return;
    }

    // Only check when document actually changes or selection changes significantly
    if (hasDocChanged || (hasSelectionChanged && !isTableInteraction)) {
      checkRemovableContent();
    }
  },
  onBlur: () => {
    handleBlur();
  },
});

// Handle Google Drive embedding
function handleGoogleDriveInsert() {
  // Show Google Drive modal
  gdriveForm.value.url = "";
  showGdriveModal.value = true;
}

// Handle Google Drive embed submit
function handleGdriveSubmit() {
  if (!editor.value || !gdriveForm.value.url) {
    showGdriveModal.value = false;
    return;
  }

  const url = gdriveForm.value.url;
  // Google Drive validation
  const fileId = $extractGoogleDriveFileId
    ? $extractGoogleDriveFileId(url)
    : extractFileId(url);

  // Jogja Cloud validation
  const jogjaCloudRegex = /^https:\/\/cloud\.jogjaprov\.go\.id\/index\.php\/s\/[A-Za-z0-9]+$/;

  if (fileId) {
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    editor.value.commands.setIframe({
      src: embedUrl,
      width: "640",
      height: "480",
      frameborder: "0",
      allowfullscreen: true,
      style: "max-width: 100%; margin: 10px 0; border-radius: 4px;",
    });
    // Langsung panggil resize handler setelah insert iframe
    setupImageResizeHandlers(editor.value);
    showGdriveModal.value = false;
    gdriveForm.value.hasError = false;
    gdriveForm.value.errorMessage = "";
  } else if (jogjaCloudRegex.test(url)) {
    // Append ?dir=/&openfile=true if not already present
    let embedUrl = url;
    if (!embedUrl.includes("?dir=/&openfile=true")) {
      embedUrl += "?dir=/&openfile=true";
    }

    // Embed Jogja Cloud link as iframe (direct link)
    editor.value.commands.setIframe({
      src: embedUrl,
      width: "640",
      height: "480",
      frameborder: "0",
      allowfullscreen: true,
      style: "max-width: 100%; margin: 10px 0; border-radius: 4px;",
    });
    // Langsung panggil resize handler setelah insert iframe
    setupImageResizeHandlers(editor.value);
    showGdriveModal.value = false;
    gdriveForm.value.hasError = false;
    gdriveForm.value.errorMessage = "";
  } else {
    gdriveForm.value.hasError = true;
    gdriveForm.value.errorMessage =
      "Invalid Google Drive or Jogja Cloud URL. Please use a valid share link.";
  }
}

// Cancel Google Drive modal
function cancelGdriveModal() {
  showGdriveModal.value = false;
  gdriveForm.value = {
    url: "https://",
    hasError: false,
    errorMessage: "",
  };
}

// Handle image upload from computer - Updated to use server upload
async function handleImageUploadClick() {
  if (!editor.value) return;

  try {
    await handleImageUpload(editor.value);
  } catch (error) {
    console.error("Image upload failed:", error);
  }
}

// Handle table insertion
function insertTable() {
  if (editor.value) {
    // Use the custom wrapper command if available, fallback to regular insert
    if (editor.value.commands.insertTableWithWrapper) {
      editor.value.commands.insertTableWithWrapper({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      });
    } else {
      editor.value.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });
    }
  }
}

// Link functions
function setLink() {
  if (!editor.value) return;

  // Get current selection
  const { from, to } = editor.value.state.selection;
  const selectedText = editor.value.state.doc.textBetween(from, to);

  // Check if there's already a link
  const previousUrl = editor.value.getAttributes("link").href;

  // Set up modal form
  linkForm.value = {
    url: previousUrl || "https://",
    text: selectedText || "",
    isEdit: !!previousUrl,
  };

  showLinkModal.value = true;
}

function handleLinkSubmit() {
  if (!editor.value || !linkForm.value.url) return;

  // If empty URL, remove link
  if (linkForm.value.url === "" || linkForm.value.url === "https://") {
    editor.value.commands.unsetLink();
    showLinkModal.value = false;
    return;
  }

  // Get current selection
  const { from, to } = editor.value.state.selection;
  const selectedText = editor.value.state.doc.textBetween(from, to);

  // If there's selected text or we're editing existing link
  if (selectedText || linkForm.value.isEdit) {
    editor.value.commands.setLink({ href: linkForm.value.url });
    showLinkModal.value = false;
    return;
  }

  // If no selected text, insert new link with custom text
  const displayText = linkForm.value.text || linkForm.value.url;

  editor.value
    .chain()
    .focus()
    .insertContent(`<a href="${linkForm.value.url}">${displayText}</a>`)
    .run();

  showLinkModal.value = false;
}

function cancelLinkModal() {
  showLinkModal.value = false;
  linkForm.value = {
    url: "",
    text: "",
    isEdit: false,
  };
}

function unsetLink() {
  editor.value.commands.unsetLink();
}

// Enhanced remove function for links and iframes
function removeContent() {
  if (!editor.value) return;

  // Remove hyperlink at cursor/selection
  if (editor.value.isActive("link")) {
    console.log("Removing link at selection...");
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  }

  // Remove image node at cursor/selection
  if (editor.value.isActive("image")) {
    console.log("Removing image at selection...");
    // Find the image node at the selection and delete it
    const { state, dispatch } = editor.value;
    const { from, to } = state.selection;
    let found = false;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        editor.value
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + node.nodeSize })
          .run();
        found = true;
        return false;
      }
    });
    if (!found) {
      // fallback: delete selection
      editor.value.commands.deleteSelection();
    }
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  }
  // Look for iframe near cursor position or in selection
  const { state } = editor.value;
  const { selection } = state;
  const { from, to } = selection;

  // Try to find iframe close to the cursor
  let foundIframe = false;
  state.doc.nodesBetween(
    Math.max(0, from - 10),
    Math.min(state.doc.content.size, to + 10),
    (node, pos) => {
      if (node.type.name === "iframe") {
        console.log("Found iframe near selection, removing...");
        editor.value
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + node.nodeSize })
          .run();
        foundIframe = true;
        return false;
      }
    }
  );

  if (foundIframe) {
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  }

  // If no iframe found near cursor but embeds exist in document, remove the first one
  if (editor.value.getHTML().includes("<iframe")) {
    console.log("Removing iframe from document...");
    // Try custom command first
    if (editor.value.commands.removeIframe) {
      const removed = editor.value.commands.removeIframe();
      if (removed) {
        setTimeout(() => {
          checkRemovableContent();
        }, 100);
        return;
      }
    }

    // Fallback: Find and remove the first iframe in the document
    let found = false;
    state.doc.descendants((node, pos) => {
      if (node.type.name === "iframe" && !found) {
        editor.value
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + node.nodeSize })
          .run();
        found = true;
        return false;
      }
    });

    if (found) {
      setTimeout(() => {
        checkRemovableContent();
      }, 100);
      return;
    }
  }

  // Remove all hyperlinks in the document if not specifically selected
  let removedLink = false;
  const htmlWithLinks = editor.value.getHTML();
  if (htmlWithLinks.includes("<a ")) {
    // Remove all anchor tags but keep the inner text
    const linkRegex = /<a\s+[^>]*href=["'][^"']*["'][^>]*>(.*?)<\/a>/gi;
    const newHTML = htmlWithLinks.replace(linkRegex, "$1");
    if (newHTML !== htmlWithLinks) {
      editor.value.commands.setContent(newHTML);
      removedLink = true;
    }
  }
  if (removedLink) {
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  }

  // Remove all images in the document if not specifically selected
  let removedImage = false;
  const htmlWithImages = editor.value.getHTML();
  if (htmlWithImages.includes("<img")) {
    const imgRegex = /<img[^>]*>/gi;
    const newHTML = htmlWithImages.replace(imgRegex, "");
    if (newHTML !== htmlWithImages) {
      editor.value.commands.setContent(newHTML);
      removedImage = true;
    }
  }
  if (removedImage) {
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  }

  // Remove all iframes in the document if not specifically selected
  let removedIframe = false;
  const htmlWithIframes = editor.value.getHTML();
  if (htmlWithIframes.includes("<iframe")) {
    const iframeRegex = /<iframe[^>]*>.*?<\/iframe>/gi;
    const newHTML = htmlWithIframes.replace(iframeRegex, "");
    if (newHTML !== htmlWithIframes) {
      editor.value.commands.setContent(newHTML);
      removedIframe = true;
    }
  }
  if (removedIframe) {
    setTimeout(() => {
      checkRemovableContent();
    }, 100);
    return;
  } // Update the removable content status after all operations
  setTimeout(() => {
    checkRemovableContent();
  }, 100);
}


// Special characters & emoji panel toggle
function toggleSpecialChars() {
  showSpecialChars.value = !showSpecialChars.value;
  if (showSpecialChars.value) showEmojiPanel.value = false;
}
function toggleEmojiPanel() {
  showEmojiPanel.value = !showEmojiPanel.value;
  if (showEmojiPanel.value) showSpecialChars.value = false;
}

// Check if there's removable content (link, image or iframe) with debouncing
function checkRemovableContent() {
  if (!editor.value) {
    canRemoveContent.value = false;
    return;
  }

  // Clear existing timeout to prevent excessive calls
  if (checkRemovableTimeout.value) {
    clearTimeout(checkRemovableTimeout.value);
  }

  checkRemovableTimeout.value = setTimeout(() => {
    // Check for active link
    if (editor.value.isActive("link")) {
      canRemoveContent.value = true;
      return;
    }

    // Check for active image
    if (editor.value.isActive("image")) {
      canRemoveContent.value = true;
      return;
    }

    // Check for hyperlinks in content
    const currentHTML = editor.value.getHTML();
    const hasLinks = currentHTML.includes("<a ");
    if (hasLinks) {
      canRemoveContent.value = true;
      return;
    }

    // Check for iframe in current HTML content
    const hasIframeInHTML = currentHTML.includes("<iframe");
    if (hasIframeInHTML) {
      canRemoveContent.value = true;
      return;
    }

    // Check for image in HTML content
    const hasImageInHTML = currentHTML.includes("<img");
    if (hasImageInHTML) {
      canRemoveContent.value = true;
      return;
    }

    // If no removable content found so far, disable the button
    canRemoveContent.value = false;
  }, 150); // Debounce with 150ms delay
}


function insertSpecialChar(char) {
  if (!editor.value) return;
  
  // Insert special char dan pastikan focus
  editor.value.chain().focus().insertContent(char).run();
  
  // Tutup panel
  showSpecialChars.value = false;
  
  // Force trigger onUpdate dengan sedikit delay
  nextTick(() => {
    const currentHTML = editor.value.getHTML();
    
    // Trigger manual update ke vee-validate
    handleChange(currentHTML);
    
    // Update computed property
    if (currentHTML !== editorData.value) {
      editorData.value = currentHTML;
    }
  });
}

function insertEmoji(emoji) {
  if (!editor.value) return;
  
  // Insert emoji dan pastikan focus
  editor.value.chain().focus().insertContent(emoji).run();
  
  // Tutup panel
  showEmojiPanel.value = false;
  
  // Force trigger onUpdate dengan sedikit delay
  nextTick(() => {
    const currentHTML = editor.value.getHTML();
    
    // Encode emoji untuk backend
    const processedHTML = currentHTML.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, (match) => {
      const codePoint = match.codePointAt(0);
      return `&#x${codePoint.toString(16)};`;
    });
    
    // Trigger manual update ke vee-validate dengan processed HTML
    handleChange(processedHTML);
    
    // Update computed property dengan original HTML untuk display
    if (currentHTML !== editorData.value) {
      editorData.value = currentHTML;
    }
  });
}

// Table operations
function addColumnBefore() {
  if (editor.value) {
    editor.value.commands.addColumnBefore();
  }
}

function addColumnAfter() {
  if (editor.value) {
    editor.value.commands.addColumnAfter();
  }
}

function deleteColumn() {
  if (editor.value) {
    editor.value.commands.deleteColumn();
  }
}

function addRowBefore() {
  if (editor.value) {
    editor.value.commands.addRowBefore();
  }
}

function addRowAfter() {
  if (editor.value) {
    editor.value.commands.addRowAfter();
  }
}

function deleteRow() {
  if (editor.value) {
    editor.value.commands.deleteRow();
  }
}

function deleteTable() {
  if (editor.value) {
    editor.value.commands.deleteTable();
  }
}

function mergeCells() {
  if (editor.value) {
    editor.value.commands.mergeCells();
  }
}

function splitCell() {
  if (editor.value) {
    editor.value.commands.splitCell();
  }
}

function toggleHeaderColumn() {
  if (editor.value) {
    editor.value.commands.toggleHeaderColumn();
  }
}

function toggleHeaderRow() {
  if (editor.value) {
    editor.value.commands.toggleHeaderRow();
  }
}

function toggleHeaderCell() {
  if (editor.value) {
    editor.value.commands.toggleHeaderCell();
  }
}

// Extract Google Drive file ID from URL (fallback function)
function extractFileId(url) {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

const editorData = computed({
  get() {
    const value = inputValue.value || props.value || "";
    return value;
  },
  set(value) {
    
    // Encode emoji untuk backend yang lebih aman
    let processedValue = value;
    if (value && value !== "<p></p>") {
      // Escape emoji characters untuk backend compatibility
      processedValue = value.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, (match) => {
        const codePoint = match.codePointAt(0);
        return `&#x${codePoint.toString(16)};`;
      });
      handleChange(processedValue);
    } else {
      handleChange("");
    }
  },
});

// Watch for external value changes
watch(
  () => props.value,
  (newValue) => {
    if (isUpdating.value) return;

    if (newValue !== inputValue.value && editor.value) {
      const currentContent = editor.value.getHTML();

      if (currentContent !== newValue) {
        isUpdating.value = true;
        editor.value.commands.setContent(newValue || "");
        handleChange(newValue || "");

        nextTick(() => {
          isUpdating.value = false;
          // Re-setup iframe handlers after content is loaded
          // This ensures that loaded iframes get proper resize functionality
          if (
            newValue &&
            newValue.includes("iframe") &&
            newValue.includes("drive.google.com")
          ) {
            setTimeout(() => {
              setupImageResizeHandlers(editor.value);
              // Debug iframe state after loading
              debugIframeState(editor.value);
            }, 300); // Small delay to ensure DOM is updated
          }
        });
      }
    }
  },
  { immediate: false }
);

// Watch for readonly/disabled changes
watch(
  () => props.readonly || props.disabled,
  (newVal) => {
    if (editor.value) {
      editor.value.setEditable(!newVal);
    }
  }
);

watch([errorMessage, () => props.isSubmitted], ([newErrorMessage, newIsSubmitted]) => {
  if (newErrorMessage && newIsSubmitted) {
    nextTick(() => {
      root.value?.scrollIntoView({ behavior: "smooth" });
    });
  }
});

// Setup drag & drop functionality when editor is mounted
onMounted(() => {
  nextTick(() => {
    if (editorElement.value && editor.value) {
      console.log('Setting up image dropzone and resize handlers');
      setupImageDropzone(editor.value, editorElement.value);
      setupImageResizeHandlers(editor.value);
    }
  });
});

onBeforeUnmount(() => {
  // Clear timeout on component unmount
  if (checkRemovableTimeout.value) {
    clearTimeout(checkRemovableTimeout.value);
  }

  if (editor.value) {
    editor.value.destroy();
  }
  // Clean up floating toggle
  removeFloatingToggle();
});
</script>

<template>
  <div class="mb-6 w-full last:mb-0" :class="{ success: meta.valid }" ref="root">
    <label v-if="label" :for="name" class="form-label mb-2 block text-sm dark:text-white md:text-base"
      :class="{ 'font-bold text-red-500': !!(errorMessage && props.isSubmitted) }">
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
    </label>
    <div class="relative">
      <ClientOnly>
        <div ref="editorElement" class="tiptap-editor" :class="{
          error: !!(errorMessage && props.isSubmitted),
          'drag-over': false,
        }">
          <!-- Toolbar -->
          <div class="tiptap-toolbar" v-if="editor">
            <!-- Text formatting -->
            <div class="toolbar-group">
              <button type="button" @click="editor.commands.toggleBold()"
                :class="{ 'is-active': editor.isActive('bold') }" class="toolbar-button" title="Bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleItalic()"
                :class="{ 'is-active': editor.isActive('italic') }" class="toolbar-button" title="Italic">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 4h-9M14 20H5M15 4L9 20" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleUnderline()"
                :class="{ 'is-active': editor.isActive('underline') }" class="toolbar-button" title="Underline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 4v7a6 6 0 0 0 12 0V4" />
                  <line x1="4" y1="20" x2="20" y2="20" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleStrike()"
                :class="{ 'is-active': editor.isActive('strike') }" class="toolbar-button" title="Strikethrough">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 16h12M4 12h16" />
                </svg>
              </button>
              <input type="color" @input="editor.commands.setColor($event.target.value)" value="#000000"
                class="toolbar-color-picker" title="Text Color" />
              <button type="button" @click="editor.commands.toggleHighlight()"
                :class="{ 'is-active': editor.isActive('highlight') }" class="toolbar-button" title="Highlight">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleSuperscript()"
                :class="{ 'is-active': editor.isActive('superscript') }" class="toolbar-button" title="Superscript">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 7h10M12 7v10" />
                  <path d="M15 3h3v3" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleSubscript()"
                :class="{ 'is-active': editor.isActive('subscript') }" class="toolbar-button" title="Subscript">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 7h10M12 7v10" />
                  <path d="M15 18h3v3" />
                </svg>
              </button>
            </div>

            <!-- Alignment -->
            <div class="toolbar-group">
              <button type="button" @click="editor.commands.setTextAlign('left')"
                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" class="toolbar-button"
                title="Align Left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="17" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="12" x2="3" y2="12" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.setTextAlign('center')"
                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="toolbar-button"
                title="Align Center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="6" />
                  <line x1="21" y1="12" x2="3" y2="12" />
                  <line x1="18" y1="18" x2="6" y2="18" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.setTextAlign('right')"
                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="toolbar-button"
                title="Align Right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="21" y1="6" x2="7" y2="6" />
                  <line x1="21" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="18" x2="7" y2="18" />
                </svg>
              </button>
            </div>

            <!-- Headers -->
            <div class="toolbar-group">
              <button type="button" @click="editor.commands.toggleHeading({ level: 1 })"
                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" class="toolbar-button"
                title="Heading 1">
                H1
              </button>
              <button type="button" @click="editor.commands.toggleHeading({ level: 2 })"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="toolbar-button"
                title="Heading 2">
                H2
              </button>
              <button type="button" @click="editor.commands.toggleHeading({ level: 3 })"
                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="toolbar-button"
                title="Heading 3">
                H3
              </button>
            </div>
            <!-- Lists and Tasks -->
            <div class="toolbar-group">
              <button type="button" @click="editor.commands.toggleBulletList()"
                :class="{ 'is-active': editor.isActive('bulletList') }" class="toolbar-button" title="Bullet List">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleOrderedList()"
                :class="{ 'is-active': editor.isActive('orderedList') }" class="toolbar-button" title="Ordered List">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="10" y1="6" x2="21" y2="6" />
                  <line x1="10" y1="12" x2="21" y2="12" />
                  <line x1="10" y1="18" x2="21" y2="18" />
                  <path d="M4 6h1v4" />
                  <path d="M4 10h2" />
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleTaskList()"
                :class="{ 'is-active': editor.isActive('taskList') }" class="toolbar-button" title="Task List">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </button>
            </div>
            <!-- Media and Links -->
            <div class="toolbar-group">
              <button type="button" @click="removeContent" :disabled="!canRemoveContent" class="toolbar-button"
                :class="{ 'is-disabled': !canRemoveContent }" title="Remove Link/Embed/Image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
                  <line x1="22" y1="2" x2="2" y2="22" />
                </svg>
              </button>
              <button type="button" @click="setLink" :class="{ 'is-active': editor.isActive('link') }"
                class="toolbar-button" title="Insert/Edit Hyperlink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
                </svg>
              </button>
              <button type="button" @click="toggleSpecialChars" class="toolbar-button" title="Special Characters">
                <!-- Icon: Greek Omega for special char -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 19a6 6 0 1 1 12 0" />
                  <path d="M6 19h12" />
                  <path d="M12 5v2" />
                </svg>
              </button>
              <button type="button" @click="toggleEmojiPanel" class="toolbar-button" title="Emoji">
                <!-- Icon: Emoji smile -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
              <button type="button" @click="handleImageUploadClick" class="toolbar-button image-upload-button"
                :class="{ uploading: isUploading }" :disabled="isUploading" title="Insert Image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <!-- Remove inline progress text to avoid double animation -->
              </button>
              <button type="button" @click="handleGoogleDriveInsert" class="toolbar-button" title="Insert Google Drive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </button>
            </div>

            <!-- Table -->
            <div class="toolbar-group">
              <button type="button" @click="insertTable" class="toolbar-button" title="Insert Table">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3z" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                  <path d="M12 3v18" />
                </svg>
              </button>

              <!-- Table controls (show only when in table) -->
              <template v-if="editor.isActive('table')">
                <button type="button" @click="addColumnBefore" class="toolbar-button" title="Add Column Before">
                  ←Col
                </button>
                <button type="button" @click="addColumnAfter" class="toolbar-button" title="Add Column After">
                  Col→
                </button>
                <button type="button" @click="addRowBefore" class="toolbar-button" title="Add Row Before">
                  ↑Row
                </button>
                <button type="button" @click="addRowAfter" class="toolbar-button" title="Add Row After">
                  Row↓
                </button>
                <button type="button" @click="deleteColumn" class="toolbar-button" title="Delete Column">
                  -Col
                </button>
                <button type="button" @click="deleteRow" class="toolbar-button" title="Delete Row">
                  -Row
                </button>
                <button type="button" @click="deleteTable" class="toolbar-button" title="Delete Table">
                  -Table
                </button>
              </template>
            </div>

            <!-- Other -->
            <div class="toolbar-group">
              <button type="button" @click="editor.commands.toggleBlockquote()"
                :class="{ 'is-active': editor.isActive('blockquote') }" class="toolbar-button" title="Blockquote">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path
                    d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </button>
              <button type="button" @click="editor.commands.toggleCodeBlock()"
                :class="{ 'is-active': editor.isActive('codeBlock') }" class="toolbar-button" title="Code Block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Editor Content -->
          <EditorContent :editor="editor" class="tiptap-content" />

          <!-- Upload Progress Overlay -->
          <div v-if="isUploading" class="upload-progress">
            <div class="text-sm mb-2">Uploading image...</div>
            <div class="upload-progress-bar">
              <div class="upload-progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <div class="text-xs mt-2">{{ uploadProgress }}%</div>
          </div>

          <!-- Special Characters Panel -->
          <div v-if="showSpecialChars" class="special-chars-panel">
            <div class="special-chars-header">
              <span class="text-sm font-medium">Special Characters</span>
              <button @click="showSpecialChars = false" class="text-gray-500 hover:text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="special-chars-grid">
              <button v-for="char in specialCharacters" :key="char.symbol" @click="insertSpecialChar(char.symbol)"
                class="special-char-btn" :title="char.name">
                {{ char.symbol }}
              </button>
            </div>
          </div>
          <!-- Emoji Panel -->
          <div v-if="showEmojiPanel" class="special-chars-panel">
            <div class="special-chars-header">
              <span class="text-sm font-medium">Emoji</span>
              <button @click="showEmojiPanel = false" class="text-gray-500 hover:text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="special-chars-grid">
              <button v-for="item in emojiList" :key="item.emoji" @click="insertEmoji(item.emoji)"
                class="special-char-btn" :title="item.name">
                {{ item.emoji }}
              </button>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>

    <!-- Link Modal -->
    <div v-if="showLinkModal" class="link-modal-overlay">
      <div class="link-modal">
        <div class="link-modal-header">
          <h3 class="text-lg font-medium">
            {{ linkForm.isEdit ? "Edit Hyperlink" : "Insert Hyperlink" }}
          </h3>
          <button @click="cancelLinkModal" class="text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="link-modal-body">
          <div class="form-group">
            <label class="block text-sm font-medium mb-2">URL</label>
            <input v-model="linkForm.url" type="url" placeholder="https://example.com" class="link-input"
              @keyup.enter="handleLinkSubmit" />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium mb-2">Link Text (optional)</label>
            <input v-model="linkForm.text" type="text" placeholder="Link display text" class="link-input"
              @keyup.enter="handleLinkSubmit" />
          </div>
        </div>
        <div class="link-modal-footer">
          <button @click="cancelLinkModal" class="btn-secondary">Cancel</button>
          <button @click="handleLinkSubmit" class="btn-primary">
            {{ linkForm.isEdit ? "Update" : "Insert" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Google Drive Modal -->
    <div v-if="showGdriveModal" class="link-modal-overlay">
      <div class="link-modal">
        <div class="link-modal-header">
          <h3 class="text-lg font-medium">Insert Google Drive Document</h3>
          <button @click="cancelGdriveModal" class="text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="link-modal-body">
          <div class="form-group">
            <label class="block text-sm font-medium mb-2">Google Drive Share or JogjaProv Cloud URL</label>
            <input v-model="gdriveForm.url" type="url" placeholder="Masukkan Link Google Drive" class="link-input"
              :class="{ 'border-red-500': gdriveForm.hasError }" @keyup.enter="handleGdriveSubmit" />
            <p v-if="gdriveForm.hasError" class="mt-1 text-xs text-red-500">
              {{ gdriveForm.errorMessage }}
            </p>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Contoh: https://drive.google.com/file/d/1AbC123XyZ/view
            </p>
          </div>
        </div>
        <div class="link-modal-footer">
          <button @click="cancelGdriveModal" class="btn-secondary">Cancel</button>
          <button @click="handleGdriveSubmit" class="btn-primary">Insert</button>
        </div>
      </div>
    </div>

    <div v-if="!!(errorMessage && props.isSubmitted)" class="mt-1 text-xs text-red-500 dark:text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
@import "~/css/tiptap-image.css";

/* Tiptap Editor Styles */
.tiptap-editor {
  border-radius: 0.5rem;
  border: 1px solid rgb(203 213 225);
  background-color: rgb(248 250 252);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.dark .tiptap-editor {
  background-color: rgb(30 41 59);
  border-color: rgb(71 85 105);
}

.tiptap-editor.error {
  border-color: rgb(239 68 68);
}

.dark .tiptap-editor.error {
  border-color: rgb(239 68 68);
}

/* Toolbar Styles */
.tiptap-toolbar {
  border-bottom: 1px solid rgb(203 213 225);
  background-color: white;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.dark .tiptap-toolbar {
  border-color: rgb(71 85 105);
  background-color: rgb(51 65 85);
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding-right: 8px;
  border-right: 1px solid rgb(203 213 225);
}

.toolbar-group:last-child {
  border-right: none;
  padding-right: 0;
}

.dark .toolbar-group {
  border-color: rgb(71 85 105);
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: rgb(71 85 105);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 600;
}

.toolbar-color-picker {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  padding: 2px;
}

.toolbar-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 4px;
}

.toolbar-color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.toolbar-button:hover {
  background-color: rgb(241 245 249);
  color: rgb(30 41 59);
}

.toolbar-button.is-active {
  background-color: rgb(37 99 235);
  color: white;
}

.dark .toolbar-button {
  color: rgb(203 213 225);
}

.dark .toolbar-button:hover {
  background-color: rgb(71 85 105);
  color: white;
}

.dark .toolbar-button.is-active {
  background-color: rgb(96 165 250);
  color: rgb(30 41 59);
}

.toolbar-button:disabled,
.toolbar-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: transparent !important;
}

.dark .toolbar-button:disabled,
.dark .toolbar-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: transparent !important;
}

/* Content Styles */
.tiptap-content {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.tiptap-editor-content {
  padding: 1rem;
  color: rgb(51 65 85);
  outline: none;
  min-height: 200px;
}

.dark .tiptap-editor-content {
  color: white;
  background-color: rgb(30 41 59);
}

.tiptap-editor-content p {
  margin: 0.5rem 0;
}

.tiptap-editor-content p:first-child {
  margin-top: 0;
}

.tiptap-editor-content p:last-child {
  margin-bottom: 0;
}

.tiptap-editor-content h1,
.tiptap-editor-content h2,
.tiptap-editor-content h3,
.tiptap-editor-content h4,
.tiptap-editor-content h5,
.tiptap-editor-content h6 {
  margin: 1rem 0 0.5rem 0;
  font-weight: bold;
  line-height: 1.3;
}

.tiptap-editor-content h1 {
  font-size: 2rem;
}

.tiptap-editor-content h2 {
  font-size: 1.5rem;
}

.tiptap-editor-content h3 {
  font-size: 1.25rem;
}

.tiptap-editor-content ul,
.tiptap-editor-content ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.tiptap-editor-content ul {
  list-style-type: disc;
}

.tiptap-editor-content ol {
  list-style-type: decimal;
}

.tiptap-editor-content li {
  margin: 0.25rem 0;
  display: list-item;
}

.tiptap-editor-content blockquote {
  border-left: 4px solid rgb(203 213 225);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: rgb(107 114 128);
}

.dark .tiptap-editor-content blockquote {
  border-color: rgb(71 85 105);
  color: rgb(156 163 175);
}

/* Emoji Styles */
.tiptap-editor-content .emoji-content {
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  font-size: inherit;
  line-height: inherit;
  vertical-align: baseline;
}

.tiptap-editor-content pre {
  background-color: rgb(241 245 249);
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo,
    monospace;
}

.dark .tiptap-editor-content pre {
  background-color: rgb(51 65 85);
  border-color: rgb(71 85 105);
}

.tiptap-editor-content code {
  background-color: rgb(241 245 249);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo,
    monospace;
  font-size: 0.875rem;
}

.dark .tiptap-editor-content code {
  background-color: rgb(51 65 85);
}

/* Superscript and Subscript Styles */
.tiptap-editor-content sup {
  vertical-align: super;
  font-size: 0.75em;
  line-height: 0;
}

.tiptap-editor-content sub {
  vertical-align: sub;
  font-size: 0.75em;
  line-height: 0;
}

/* Link Styles */
.tiptap-editor-content a {
  color: rgb(59 130 246);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tiptap-editor-content a:hover {
  color: rgb(37 99 235);
  text-decoration: underline;
}

.dark .tiptap-editor-content a {
  color: rgb(96 165 250);
}

.dark .tiptap-editor-content a:hover {
  color: rgb(147 197 253);
}

/* Image Styles */
.tiptap-editor-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

/* Table Styles with Horizontal Scroll */
.tiptap-editor-content .table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  margin: 1rem 0;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  background: white;
}

.dark .tiptap-editor-content .table-wrapper {
  border-color: rgb(71 85 105);
  background: rgb(30 41 59);
}

.tiptap-editor-content table {
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
  /* Allow table to grow beyond container */
  table-layout: auto;
  /* Return to auto for proportional columns */
  position: relative;
  margin: 0;
  /* Remove margin since wrapper handles it */
  border: none;
  /* Remove border since wrapper handles it */
}

.tiptap-editor-content th,
.tiptap-editor-content td {
  border: 1px solid rgb(203 213 225);
  padding: 0.5rem;
  text-align: left;
  vertical-align: top;
  min-width: 120px;
  /* Increased for better proportion */
  position: relative;
  white-space: nowrap;
  /* Prevent text wrapping for better table structure */
}

/* Allow text wrapping only for very long content */
.tiptap-editor-content td.wrap-text,
.tiptap-editor-content th.wrap-text {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 300px;
}

.tiptap-editor-content th {
  background-color: rgb(249 250 251);
  font-weight: 600;
}

.dark .tiptap-editor-content th {
  background-color: #27354c !important;
}

.dark .tiptap-editor-content th,
.dark .tiptap-editor-content td {
  border-color: rgb(71 85 105);
}

.dark .tiptap-editor-content th {
  background-color: rgb(51 65 85);
}

/* Table cell selection */
.tiptap-editor-content .selectedCell {
  background-color: rgb(219 234 254);
}

.dark .tiptap-editor-content .selectedCell {
  background-color: rgb(30 58 138);
}

/* Iframe Styles - Enhanced for Google Drive embeds */
.tiptap-editor-content iframe {
  max-width: 100%;
  width: 100%;
  min-height: 400px;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  margin: 1rem 0;
  display: block;
  background: white;
}

.dark .tiptap-editor-content iframe {
  border-color: rgb(71 85 105);
  background: rgb(30 41 59);
}

/* Figure Styles for CKEditor compatibility */
.tiptap-editor-content figure {
  margin: 1rem 0;
  display: block;
}

.tiptap-editor-content figure.image {
  text-align: center;
}

.tiptap-editor-content figure.image_resized {
  display: inline-block;
  max-width: 100%;
}

.tiptap-editor-content figure img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
}

/* Responsive iframe handling */
@media (max-width: 768px) {
  .tiptap-editor-content iframe {
    width: 100% !important;
    height: 300px !important;
    min-height: 300px;
  }
}

/* Link Styles */
.tiptap-editor-content a {
  color: rgb(37 99 235);
  text-decoration: underline;
  cursor: pointer;
}

.tiptap-editor-content a:hover {
  color: rgb(29 78 216);
}

.dark .tiptap-editor-content a {
  color: rgb(96 165 250);
}

.dark .tiptap-editor-content a:hover {
  color: rgb(147 197 253);
}

/* Highlight Styles */
.tiptap-editor-content mark {
  background-color: rgb(254 240 138);
  color: rgb(92 41 0);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.dark .tiptap-editor-content mark {
  background-color: rgb(146 64 14);
  color: rgb(254 215 170);
}

/* Text alignment */
.tiptap-editor-content .has-text-align-left {
  text-align: left;
}

.tiptap-editor-content .has-text-align-center {
  text-align: center;
}

.tiptap-editor-content .has-text-align-right {
  text-align: right;
}

.tiptap-editor-content .has-text-align-justify {
  text-align: justify;
}

/* Task List Styles */
.tiptap-editor-content ul[data-type="taskList"] {
  list-style: none;
  padding-left: 0;
}

.tiptap-editor-content ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 0;
  list-style: none;
}

.tiptap-editor-content li[data-type="taskItem"] {
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 0;
  list-style: none;
}

.tiptap-editor-content li[data-type="taskItem"]>label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap-editor-content li[data-type="taskItem"]>div {
  flex: 1 1 auto;
}

.tiptap-editor-content li[data-type="taskItem"] input[type="checkbox"] {
  cursor: pointer;
}

/* Regular Lists - ensure they show markers */
.tiptap-editor-content ul:not([data-type="taskList"]) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.tiptap-editor-content ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.tiptap-editor-content ul:not([data-type="taskList"]) li {
  display: list-item;
  list-style: inherit;
  margin: 0.25rem 0;
}

.tiptap-editor-content ol li {
  display: list-item;
  list-style: inherit;
  margin: 0.25rem 0;
}

/* Nested lists */
.tiptap-editor-content ul:not([data-type="taskList"]) ul {
  list-style-type: circle;
}

.tiptap-editor-content ul:not([data-type="taskList"]) ul ul {
  list-style-type: square;
}

/* Special Characters Panel */
.special-chars-panel {
  border-top: 1px solid rgb(203 213 225);
  background-color: white;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.dark .special-chars-panel {
  border-color: rgb(71 85 105);
  background-color: rgb(51 65 85);
}

.special-chars-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.special-chars-header span {
  color: rgb(51 65 85);
}

.dark .special-chars-header span {
  color: white;
}

.special-chars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 0.25rem;
}

.special-char-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.25rem;
  background-color: white;
  color: rgb(51 65 85);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.special-char-btn:hover {
  background-color: rgb(243 244 246);
  border-color: rgb(156 163 175);
}

.dark .special-char-btn {
  border-color: rgb(71 85 105);
  background-color: rgb(30 41 59);
  color: white;
}

.dark .special-char-btn:hover {
  background-color: rgb(71 85 105);
  border-color: rgb(156 163 175);
}

/* Placeholder */
.tiptap-editor-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: rgb(156 163 175);
  pointer-events: none;
  height: 0;
}

.dark .tiptap-editor-content p.is-editor-empty:first-child::before {
  color: rgb(107 114 128);
}

/* Responsive */
@media (max-width: 768px) {
  .tiptap-toolbar {
    padding: 4px;
    gap: 2px;
  }

  .toolbar-group {
    padding-right: 4px;
  }

  .toolbar-button {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  .tiptap-editor-content {
    padding: 0.75rem;
  }

  .tiptap-editor-content iframe {
    width: 100% !important;
    height: 300px !important;
  }
}

/* Focus styles */
.tiptap-editor-content:focus {
  outline: none;
}

.tiptap-editor:focus-within {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.dark .tiptap-editor:focus-within {
  border-color: rgb(96 165 250);
  box-shadow: 0 0 0 3px rgb(96 165 250 / 0.1);
}

/* Link Modal Styles */
.link-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.link-modal {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
}

.dark .link-modal {
  background: rgb(51 65 85);
  color: white;
}

.link-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgb(229 231 235);
}

.dark .link-modal-header {
  border-color: rgb(75 85 99);
}

.link-modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.link-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.link-input:focus {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.dark .link-input {
  background: rgb(75 85 99);
  border-color: rgb(107 114 128);
  color: white;
}

.dark .link-input:focus {
  border-color: rgb(96 165 250);
  box-shadow: 0 0 0 3px rgb(96 165 250 / 0.1);
}

.link-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgb(229 231 235);
}

.dark .link-modal-footer {
  border-color: rgb(75 85 99);
}

.btn-primary {
  background-color: rgb(59 130 246);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-primary:hover {
  background-color: rgb(37 99 235);
}

.btn-secondary {
  background-color: white;
  color: rgb(75 85 99);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid rgb(209 213 219);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.btn-secondary:hover {
  background-color: rgb(249 250 251);
  border-color: rgb(156 163 175);
}

.dark .btn-secondary {
  background-color: rgb(75 85 99);
  color: white;
  border-color: rgb(107 114 128);
}

.dark .btn-secondary:hover {
  background-color: rgb(107 114 128);
  border-color: rgb(156 163 175);
}

/* Table Stability Fixes - Prevent hover glitches while maintaining proportions */
.tiptap-editor-content .table-wrapper:hover {
  /* Prevent wrapper from changing size */
  overflow-x: auto !important;
}

.tiptap-editor-content table {
  /* Prevent table from jumping during interactions */
  position: relative;
  transition: none !important;
}

.tiptap-editor-content th,
.tiptap-editor-content td {
  /* Prevent cell size changes but allow natural sizing */
  box-sizing: border-box;
  transition: none !important;
  /* Remove hover effects that might cause glitches */
}

.tiptap-editor-content th:hover,
.tiptap-editor-content td:hover {
  /* Subtle hover effect without size changes */
  background-color: rgba(59, 130, 246, 0.05);
}

.dark .tiptap-editor-content th:hover,
.dark .tiptap-editor-content td:hover {
  background-color: rgba(96, 165, 250, 0.1);
}

/* Disable problematic table resize handles */
.tiptap-editor-content table .grip-column,
.tiptap-editor-content table .grip-row,
.tiptap-editor-content table .grip-table {
  display: none !important;
}

/* Override any prosemirror table plugin styles that might cause issues */
.ProseMirror .tableWrapper {
  overflow-x: auto !important;
  overflow-y: visible !important;
}

.ProseMirror table {
  table-layout: auto !important;
  /* Allow natural table sizing */
  min-width: max-content !important;
}

/* Hide column resize handles to prevent glitches */
.ProseMirror .column-resize-handle {
  display: none !important;
}

/* Scrollbar styling for table wrapper */
.tiptap-editor-content .table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.tiptap-editor-content .table-wrapper::-webkit-scrollbar-track {
  background: rgb(241 245 249);
  border-radius: 3px;
}

.tiptap-editor-content .table-wrapper::-webkit-scrollbar-thumb {
  background: rgb(203 213 225);
  border-radius: 3px;
}

.tiptap-editor-content .table-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgb(156 163 175);
}

.dark .tiptap-editor-content .table-wrapper::-webkit-scrollbar-track {
  background: rgb(51 65 85);
}

.dark .tiptap-editor-content .table-wrapper::-webkit-scrollbar-thumb {
  background: rgb(71 85 105);
}

.dark .tiptap-editor-content .table-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgb(100 116 139);
}

/* Fallback for existing tables without wrapper - provide horizontal scroll */
.tiptap-editor-content table:not(.table-wrapper table) {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  width: max-content;
  max-width: 100%;
}

.tiptap-editor-content table:not(.table-wrapper table) tbody,
.tiptap-editor-content table:not(.table-wrapper table) thead {
  display: table;
  width: 100%;
}

/* Responsive table behavior */
@media (max-width: 768px) {
  .tiptap-editor-content .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tiptap-editor-content table {
    min-width: 600px;
    /* Ensure minimum width on mobile */
  }

  .tiptap-editor-content th,
  .tiptap-editor-content td {
    min-width: 100px;
    padding: 0.25rem;
    /* Reduce padding on mobile */
  }
}
</style>
