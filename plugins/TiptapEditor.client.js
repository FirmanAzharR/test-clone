import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Underline from '@tiptap/extension-underline'
import { Node, mergeAttributes } from '@tiptap/core'

export default defineNuxtPlugin(async (nuxtApp) => {
  
  // Custom Iframe Extension for Google Drive embeds
  const IframeExtension = Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,
    
    addAttributes() {
      return {
        src: {
          default: null,
        },
        width: {
          default: null,
        },
        height: {
          default: null,
        },
        frameborder: {
          default: '0',
        },
        allowfullscreen: {
          default: true,
        },
        style: {
          default: null,
        },
      }
    },
    
    parseHTML() {
      return [
        {
          tag: 'iframe',
        },
      ]
    },
    
    renderHTML({ HTMLAttributes }) {
      return ['iframe', mergeAttributes(HTMLAttributes)]
    },    addCommands() {
      return {
        setIframe: options => ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
        removeIframe: () => ({ state, dispatch, tr }) => {
          const { from, to } = state.selection;
          const doc = state.doc;
          let removed = false;
          
          // First, check if there's a selected iframe
          if (from !== to) {
            const selectedContent = doc.slice(from, to);
            selectedContent.content.forEach((node) => {
              if (node.type.name === 'iframe') {
                if (dispatch) {
                  const transaction = state.tr.deleteSelection();
                  dispatch(transaction);
                }
                removed = true;
              }
            });
            
            if (removed) return true;
          }
          
          // Check if cursor is directly on an iframe
          const $pos = doc.resolve(from);
          if ($pos.parent.type.name === 'iframe') {
            if (dispatch) {
              const nodeStart = $pos.start();
              const transaction = state.tr.delete(nodeStart, nodeStart + $pos.parent.nodeSize);
              dispatch(transaction);
            }
            return true;
          }
          
          // Find nearest iframe within reasonable distance
          let nearestIframe = null;
          let minDistance = Infinity;
          
          doc.descendants((node, pos) => {
            if (node.type.name === 'iframe') {
              const distance = Math.abs(pos - from);
              if (distance < minDistance && distance <= 200) {
                minDistance = distance;
                nearestIframe = { pos, size: node.nodeSize };
              }
            }
          });
          
          if (nearestIframe && dispatch) {
            const transaction = state.tr.delete(nearestIframe.pos, nearestIframe.pos + nearestIframe.size);
            dispatch(transaction);
            return true;
          }
          
          return false;
        },
      }
    },
  });

  // Custom Figure Extension for CKEditor compatibility
  const FigureExtension = Node.create({
    name: 'figure',
    group: 'block',
    content: 'image',
    
    addAttributes() {
      return {
        class: {
          default: null,
        },
        style: {
          default: null,
        },
      }
    },
    
    parseHTML() {
      return [
        {
          tag: 'figure',
        },
      ]
    },
    
    renderHTML({ HTMLAttributes }) {
      return ['figure', mergeAttributes(HTMLAttributes), 0]
    },
    
    addCommands() {
      return {
        setImageWithFigure: (options) => ({ commands }) => {
          return commands.insertContent({
            type: 'figure',
            attrs: {
              class: 'image image_resized',
              style: options.width ? `width: ${options.width};` : 'width: 100%;'
            },
            content: [{
              type: 'image',
              attrs: {
                src: options.src,
                alt: options.alt || ''
              }
            }]
          })
        },
      }
    },
  });

  // Custom Table Wrapper Extension for horizontal scroll
  const TableWrapperExtension = Node.create({
    name: 'tableWrapper',
    group: 'block',
    content: 'table',
    isolating: true,
    
    parseHTML() {
      return [
        {
          tag: 'div[class*="table-wrapper"]',
        },
      ]
    },
    
    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { class: 'table-wrapper' }), 0]
    },
    
    addCommands() {
      return {
        insertTableWithWrapper: (options = {}) => ({ commands }) => {
          const { rows = 3, cols = 3, withHeaderRow = true } = options;
          return commands.insertContent({
            type: 'tableWrapper',
            content: [{
              type: 'table',
              content: Array.from({ length: rows }, (_, rowIndex) => ({
                type: 'tableRow',
                content: Array.from({ length: cols }, () => ({
                  type: rowIndex === 0 && withHeaderRow ? 'tableHeader' : 'tableCell',
                  content: [{ type: 'paragraph' }]
                }))
              }))
            }]
          });
        },
      }
    },
  });

  // Custom Google Drive file ID extractor
  function extractGoogleDriveFileId(url) {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }
  // Configure Tiptap extensions
  const extensions = [
    StarterKit,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Color.configure({
      types: ['textStyle'],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'tiptap-link',
      },
    }),
    FigureExtension,
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'tiptap-image',
        style: 'max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0;'
      },
      addCommands() {
        return {
          setImage: options => ({ commands }) => {
            // Override the default setImage to wrap in figure
            return commands.setImageWithFigure(options)
          },
        }
      },
    }),TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Superscript,
    Subscript,
    Underline,
    IframeExtension,
    TableWrapperExtension, // Add table wrapper before table
    Table.configure({
      resizable: false, // Keep disabled to prevent hover glitch
      HTMLAttributes: {
        class: 'tiptap-table',
        style: 'border-collapse: collapse; width: 100%; margin: 0; min-width: max-content;'
      }
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'tiptap-table-row'
      }
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'tiptap-table-header',
        style: 'border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6; font-weight: bold;'
      }
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'tiptap-table-cell',
        style: 'border: 1px solid #ccc; padding: 8px;'
      }
    }),
    TableWrapperExtension
  ];
  // Make utilities available globally
  nuxtApp.provide('Editor', Editor);  nuxtApp.provide('TiptapExtensions', {
    StarterKit,
    Image,
    Table,
    TableRow,
    TableHeader,
    TableCell,
    TextAlign,
    Color,
    Highlight,
    Link,
    TextStyle,
    TaskList,
    TaskItem,
    Superscript,
    Subscript,
    Underline,
    IframeExtension,
    FigureExtension,
    TableWrapperExtension
  });
  nuxtApp.provide('extractGoogleDriveFileId', extractGoogleDriveFileId);
  nuxtApp.provide('tiptapExtensions', extensions);
});
