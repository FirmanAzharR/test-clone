import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// Enhanced Figure Extension with image resizing for CKEditor compatibility
export const ResizableFigure = Node.create({
  name: 'resizableFigure',
  
  group: 'block',
  
  content: 'inline*',
  
  addAttributes() {
    return {
      class: {
        default: 'image',
        renderHTML: attributes => ({
          class: attributes.class,
        }),
      },
      style: {
        default: 'width:100%;',
        renderHTML: attributes => ({
          style: attributes.style,
        }),
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (element) => {
          const figureClass = element.getAttribute('class') || 'image'
          const figureStyle = element.getAttribute('style') || 'width:100%;'
          return {
            class: figureClass,
            style: figureStyle,
          }
        },
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setResizableFigure: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
      updateFigureSize: (percentage) => ({ tr, state, dispatch }) => {
        const { selection } = state
        const { from, to } = selection
        let figurePos = null
        
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name === this.name) {
            figurePos = pos
            return false
          }
        })
        
        if (figurePos !== null && dispatch) {
          const figureNode = state.doc.nodeAt(figurePos)
          if (figureNode) {
            const currentClass = figureNode.attrs.class
            const newClass = currentClass.includes('image_resized') 
              ? currentClass 
              : `${currentClass} image_resized`
            
            const newAttrs = { 
              ...figureNode.attrs, 
              class: newClass,
              style: `width:${percentage}%;`
            }
            tr.setNodeMarkup(figurePos, null, newAttrs)
            return true
          }
        }
        
        return false
      },
    }
  },
    
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('figureResize'),
        props: {
          decorations: (state) => {
            const decorations = []
            const { doc, selection } = state
            const { from, to } = selection
            
            // Only show resize handles for selected figures
            doc.nodesBetween(from, to, (node, pos) => {
              if (node.type.name === this.name) {
                const decoration = Decoration.widget(pos + 1, () => {
                  const resizeContainer = document.createElement('div')
                  resizeContainer.className = 'figure-resize-container'
                  resizeContainer.style.cssText = `
                    position: absolute;
                    border: 2px solid #3b82f6;
                    pointer-events: none;
                    z-index: 10;
                    border-radius: 4px;
                  `
                  
                  // Create resize handle (bottom-right corner)
                  const resizeHandle = document.createElement('div')
                  resizeHandle.className = 'resize-handle resize-se'
                  resizeHandle.style.cssText = `
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: #3b82f6;
                    border: 2px solid white;
                    border-radius: 2px;
                    pointer-events: auto;
                    cursor: se-resize;
                    bottom: -6px;
                    right: -6px;
                  `
                  
                  resizeContainer.appendChild(resizeHandle)
                  
                  return resizeContainer
                })
                
                decorations.push(decoration)
              }
            })
            
            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

// Enhanced Image Extension that works inside figures
export const ResizableImage = Node.create({
  name: 'resizableImage',
  
  group: 'inline',
  
  inline: true,
  
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
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
        tag: 'img[src]',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          title: element.getAttribute('title'),
          style: element.getAttribute('style')
        }),
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },
})

//  Image resize utilities with percentage-based sizing for CKEditor compatibility
export const useImageResize = () => {
  let isResizing = false
  let startX = 0
  let startWidth = 0
  let maxWidth = 0
  let currentFloatingToggle = null
  let currentGdriveIcon = null
  
  const startResize = (e, figureElement, editor) => {
    e.preventDefault()
    e.stopPropagation()
    isResizing = true
    
    startX = e.clientX
    const computedStyle = window.getComputedStyle(figureElement)
    startWidth = parseInt(computedStyle.width, 10)
    
    // Get the editor container width to calculate percentages
    const editorContainer = figureElement.closest('.ProseMirror')
    maxWidth = editorContainer ? editorContainer.clientWidth : 800
    
    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
    
    // Add visual feedback
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'se-resize'
    
    function handleResize(e) {
      if (!isResizing) return
      
      const currentX = e.clientX
      const deltaX = currentX - startX
      
      let newWidth = startWidth + deltaX
      
      // Set minimum and maximum constraints
      const minWidth = 100 // minimum 100px
      const maxWidthPx = maxWidth * 0.95 // max 95% of container
      
      newWidth = Math.max(minWidth, Math.min(maxWidthPx, newWidth))
      
      // Calculate percentage
      const percentage = Math.round((newWidth / maxWidth) * 100 * 10) / 10 // Round to 1 decimal
      
      // Update figure size visually
      figureElement.style.width = percentage + '%'
      
      // Show percentage indicator
      showPercentageIndicator(figureElement, percentage)
    }
    
    function stopResize() {
      if (!isResizing) return
      
      isResizing = false
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
      
      // Remove visual feedback
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      // Hide percentage indicator
      hidePercentageIndicator()
      
      // Update the node attributes in the editor
      const computedStyle = window.getComputedStyle(figureElement)
      const finalWidth = parseInt(computedStyle.width, 10)
      const finalPercentage = Math.round((finalWidth / maxWidth) * 100 * 10) / 10
      
      if (editor && editor.commands.updateFigureSize) {
        editor.commands.updateFigureSize(finalPercentage)
      }
    }
  }
  
  const showPercentageIndicator = (element, percentage) => {
    // Remove existing indicator
    hidePercentageIndicator()
    
    const indicator = document.createElement('div')
    indicator.id = 'resize-percentage-indicator'
    indicator.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 1001;
      pointer-events: none;
      top: -30px;
      right: 0;
    `
    indicator.textContent = `${percentage}%`
    
    const rect = element.getBoundingClientRect()
    indicator.style.left = (rect.right - 60) + 'px'
    indicator.style.top = (rect.top - 30) + 'px'
    
    document.body.appendChild(indicator)
  }
    const hidePercentageIndicator = () => {
    const indicator = document.getElementById('resize-percentage-indicator')
    if (indicator) {
      indicator.remove()
    }
  }  // Create floating toggle for simple image resize
  const createFloatingToggle = (figure, editor) => {
    // Remove existing toggle
    removeFloatingToggle()
    
    const rect = figure.getBoundingClientRect()
    const currentStyle = figure.getAttribute('style') || 'width:100%;'
    const currentWidth = currentStyle.match(/width:\s*(\d+(?:\.\d+)?)%/) 
      ? parseFloat(currentStyle.match(/width:\s*(\d+(?:\.\d+)?)%/)[1])
      : 100

    // Get editor boundaries to constrain the toggle position
    const editorElement = figure.closest('.tiptap-editor') || figure.closest('.ProseMirror') || figure.closest('[data-editor]')
    const editorRect = editorElement ? editorElement.getBoundingClientRect() : { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }

    const toggle = document.createElement('div')
    toggle.id = 'image-resize-toggle'
    toggle.className = 'image-resize-toggle'
    toggle.style.cssText = `
      position: fixed;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(8px);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      z-index: 1001;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 200px;
      animation: slideIn 0.2s ease-out;
    `

    // Enhanced positioning logic constrained within editor boundaries
    const toggleWidth = 220 // Approximate toggle width
    const toggleHeight = 70 // Approximate toggle height
    const padding = 10

    // Calculate preferred position (above image, centered)
    let toggleTop = rect.top - toggleHeight - padding
    let toggleLeft = rect.left + (rect.width / 2) - (toggleWidth / 2)

    // Constrain vertically
    if (toggleTop < editorRect.top + padding) {
      // Not enough space above image, try below
      toggleTop = rect.bottom + padding
      
      // If still not enough space below, position at editor bottom
      if (toggleTop + toggleHeight > editorRect.bottom - padding) {
        toggleTop = editorRect.bottom - toggleHeight - padding
      }
    }

    // Constrain horizontally
    if (toggleLeft < editorRect.left + padding) {
      toggleLeft = editorRect.left + padding
    } else if (toggleLeft + toggleWidth > editorRect.right - padding) {
      toggleLeft = editorRect.right - toggleWidth - padding
    }

    // Final boundary checks
    toggleTop = Math.max(editorRect.top + padding, Math.min(toggleTop, editorRect.bottom - toggleHeight - padding))
    toggleLeft = Math.max(editorRect.left + padding, Math.min(toggleLeft, editorRect.right - toggleWidth - padding))
    
    toggle.style.top = `${toggleTop}px`
    toggle.style.left = `${toggleLeft}px`

    // Create toggle content
    toggle.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-weight: 500; color: #e2e8f0;">Width:</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <input 
            type="number" 
            id="width-input" 
            value="${currentWidth}" 
            min="10" 
            max="100" 
            step="5"
            style="
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 4px;
              color: white;
              padding: 6px 8px;
              width: 60px;
              font-size: 13px;
              text-align: center;
            "
          />
          <span style="color: #94a3b8;">%</span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button 
            id="apply-resize" 
            style="
              background: #3b82f6;
              border: none;
              border-radius: 4px;
              color: white;
              padding: 6px 12px;
              font-size: 12px;
              cursor: pointer;
              transition: background 0.2s;
            "
          >Apply</button>
          <button 
            id="close-toggle" 
            style="
              background: rgba(255, 255, 255, 0.1);
              border: none;
              border-radius: 4px;
              color: #94a3b8;
              padding: 6px 8px;
              font-size: 12px;
              cursor: pointer;
              transition: background 0.2s;
            "
          >×</button>
        </div>
      </div>
    `

    // Debug logging and extra event protection for Google Drive toggle
    toggle.addEventListener('click', (e) => {
      e.stopPropagation() // Prevent event from bubbling up
    })

    // Add specific handlers for input fields to prevent closure
    const inputs = toggle.querySelectorAll('input, button, select, textarea')
    inputs.forEach(input => {
      input.addEventListener('click', (e) => {
        console.log('Click on Google Drive input/button:', e.target.tagName, e.target.id)
        e.stopPropagation() // Extra protection
      })
      
      input.addEventListener('focus', (e) => {
      })
    })

    // Add CSS animation if not exists
    if (!document.querySelector('style[data-image-resize-animation]')) {
      const style = document.createElement('style')
      style.setAttribute('data-image-resize-animation', 'true')
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        #image-resize-toggle input:focus {
          outline: none;
          border-color: #3b82f6 !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        #image-resize-toggle button:hover {
          opacity: 0.8;
        }
        
        #apply-resize:hover {
          background: #2563eb !important;
        }
        
        #close-toggle:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(toggle)
    currentFloatingToggle = toggle

    // Add event listeners
    const widthInput = toggle.querySelector('#width-input')
    const applyBtn = toggle.querySelector('#apply-resize')
    const closeBtn = toggle.querySelector('#close-toggle')

    // Auto-focus the input
    setTimeout(() => {
      widthInput.focus()
      widthInput.select()
    }, 100)

    // Apply resize function
    const applyResize = () => {
      const newWidth = parseFloat(widthInput.value)
      if (newWidth >= 10 && newWidth <= 100) {
        console.log('Applying resize to:', newWidth, '%')
        updateFigureWidth(figure, newWidth, editor)
        removeFloatingToggle()
      }
    }

    // Event listeners
    applyBtn.addEventListener('click', applyResize)
    closeBtn.addEventListener('click', removeFloatingToggle)
    
    widthInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        applyResize()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        removeFloatingToggle()
      }
    })    // Enhanced outside click detection for image toggle
    const handleOutsideClick = (e) => {
      // Check if click is inside the toggle element or any of its children
      if (toggle.contains(e.target)) {
        return // Don't close if clicking inside toggle
      }
      
      // Check if click is on the target figure
      if (figure.contains(e.target)) {
        return // Don't close if clicking on figure
      }
      
      // Check if click is on any interactive element inside toggle
      if (e.target.matches('input, button, select, textarea') && toggle.contains(e.target)) {
        return // Don't close if clicking on form elements
      }
      
      // Close toggle if clicking truly outside
      removeFloatingToggle()
    }

    // Prevent toggle content from triggering outside click
    toggle.addEventListener('click', (e) => {
      e.stopPropagation() // Prevent event from bubbling up
    })

    // Add outside click listener with delay
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, true) // Use capture phase
      
      // Store cleanup function
      toggle._cleanupOutsideClick = () => {
        document.removeEventListener('click', handleOutsideClick, true)
      }
    }, 150)

    return toggle
  }
  // Remove floating toggle
  const removeFloatingToggle = () => {
    if (currentFloatingToggle) {
      
      // Clean up outside click listener if it exists
      if (currentFloatingToggle._cleanupOutsideClick) {
        currentFloatingToggle._cleanupOutsideClick()
      }
      
      currentFloatingToggle.remove()
      currentFloatingToggle = null
    }
    
    // DON'T remove Google Drive icon when toggle is closed - keep it for continuous resize
    // removeGdriveFloatingIcon() - commented out to allow continuous resize
    
    // Remove animation styles
    const existingStyle = document.querySelector('style[data-image-resize-animation]')
    if (existingStyle) {
      existingStyle.remove()
    }
  }

  // Update figure width
  const updateFigureWidth = (figure, percentage, editor) => {
    const newClass = figure.className.includes('image_resized') 
      ? figure.className 
      : `${figure.className} image_resized`.trim()
    
    figure.className = newClass
    figure.style.width = `${percentage}%`

    // Update in editor state if available
    if (editor && editor.isEditable) {
      const transaction = editor.state.tr
      let updated = false

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'resizableFigure' || node.type.name === 'figure') {
          const domNode = editor.view.nodeDOM(pos)
          if (domNode === figure || domNode?.contains(figure)) {
            const newAttrs = {
              ...node.attrs,
              class: newClass,
              style: `width:${percentage}%;`
            }
            transaction.setNodeMarkup(pos, null, newAttrs)
            updated = true
            return false
          }
        }
      })

      if (updated) {
        editor.view.dispatch(transaction)
      }
    }

    // Show success feedback
    showResizeSuccess(percentage)
  }

  // Show resize success feedback
  const showResizeSuccess = (percentage) => {
    const feedback = document.createElement('div')
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 1002;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `
    feedback.textContent = `Image resized to ${percentage}%`

    // Add animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `
    document.head.appendChild(style)

    document.body.appendChild(feedback)

    setTimeout(() => {
      feedback.style.animation = 'slideInRight 0.3s ease-out reverse'
      setTimeout(() => {
        feedback.remove()
        style.remove()
      }, 300)
    }, 2000)
  }
    const setupImageResizeHandlers = (editor) => {
    if (!editor) return
    
    const editorElement = editor.view.dom
    if (!editorElement) return
      // Setup Google Drive iframe handlers
    const cleanupGdrive = setupGdriveIframeHandlers(editor)
    
    // Setup scroll handlers for floating elements
    const cleanupScroll = setupScrollHandlers(editor)
    
    // Setup resize handlers for floating elements
    const cleanupResize = setupResizeHandlers(editor)
    
    // Handle click specifically on images or figures
    const handleImageClick = (e) => {
      // Check if the clicked element is an image or inside a figure
      const img = e.target.tagName === 'IMG' ? e.target : null
      const figure = e.target.closest('figure')
      
      // Only proceed if we clicked on an actual image or a figure containing an image
      if (img || (figure && figure.querySelector('img'))) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('Image clicked:', { img, figure })
        
        // Find the target figure (either the clicked figure or the figure containing the clicked image)
        const targetFigure = figure || img?.closest('figure')
        
        if (targetFigure && (targetFigure.classList.contains('image') || targetFigure.querySelector('img'))) {
          
          // Remove any existing toggles
          removeFloatingToggle()
          
          // Create the floating toggle
          createFloatingToggle(targetFigure, editor)
        }
      }
    }
    
    // Handle clicks outside to close toggle
    const handleDocumentClick = (e) => {
      const toggle = document.getElementById('image-resize-toggle') || document.getElementById('gdrive-resize-toggle')
      const isImageClick = e.target.tagName === 'IMG' || e.target.closest('figure')
      
      if (toggle && !toggle.contains(e.target) && !isImageClick) {
        removeFloatingToggle()
      }
    }
    
    // Add event listener with capture to ensure we catch image clicks first
    editorElement.addEventListener('click', handleImageClick, true)
    document.addEventListener('click', handleDocumentClick)
    
    // Also add a more specific listener for images
    const handleDirectImageClick = (e) => {
      if (e.target.tagName === 'IMG') {
        console.log('Direct image click detected')
        handleImageClick(e)
      }
    }
    
    editorElement.addEventListener('click', handleDirectImageClick)    // Cleanup function
    return () => {
      editorElement.removeEventListener('click', handleImageClick, true)
      editorElement.removeEventListener('click', handleDirectImageClick)
      document.removeEventListener('click', handleDocumentClick)
      removeFloatingToggle()
      hidePercentageIndicator()
      if (cleanupGdrive) cleanupGdrive()
      if (cleanupScroll) cleanupScroll()
      if (cleanupResize) cleanupResize()
    }
  }  // Google Drive iframe resize functions
  const createGdriveFloatingIcon = (iframe, editor = null) => {
    // Remove existing icon
    removeGdriveFloatingIcon()
    
    const rect = iframe.getBoundingClientRect()
    
    // Get editor areas for proper positioning
    const editorElement = iframe.closest('.tiptap-editor') || iframe.closest('.ProseMirror') || iframe.closest('[data-editor]')
    const editorAreas = findEditorAreas(editorElement)
    
    if (!editorAreas) {
      console.warn('Could not find editor areas for Google Drive icon positioning')
      return null
    }
    
    const editorRect = editorAreas.container.getBoundingClientRect()
    const toolbarRect = editorAreas.toolbar.getBoundingClientRect()
    const contentRect = editorAreas.content.getBoundingClientRect()
    
    // Check if iframe is sufficiently visible in content area
    const visibleRect = {
      top: Math.max(rect.top, contentRect.top),
      bottom: Math.min(rect.bottom, contentRect.bottom),
      left: Math.max(rect.left, contentRect.left),
      right: Math.min(rect.right, contentRect.right)
    }
    
    const iframeHeight = rect.bottom - rect.top
    const visibleHeight = Math.max(0, visibleRect.bottom - visibleRect.top)
    const visibilityRatio = iframeHeight > 0 ? visibleHeight / iframeHeight : 0
    
    // Don't show icon if iframe is not sufficiently visible (less than 30%)
    if (visibilityRatio < 0.3) {
      console.log('Google Drive iframe not sufficiently visible, skipping icon creation')
      return null
    }
    
    // Calculate constrained position
    const iconSize = 24
    const padding = 8
    const minTop = toolbarRect.bottom + padding
    
    // Position icon within visible area of iframe, but below toolbar
    let iconTop = Math.max(visibleRect.top + padding, minTop)
    let iconLeft = Math.max(visibleRect.left + padding, contentRect.left + padding)    // Ensure icon stays within content boundaries
    if (iconTop + iconSize > contentRect.bottom - padding) {
      iconTop = contentRect.bottom - iconSize - padding
    }
    
    if (iconLeft + iconSize > contentRect.right - padding) {
      iconLeft = contentRect.right - iconSize - padding
    }
    
    // Final safety check - always below toolbar
    iconTop = Math.max(iconTop, minTop)
    
    const icon = document.createElement('div')
    icon.id = 'gdrive-resize-icon'
    icon.className = 'gdrive-resize-icon'
    icon.style.cssText = `
      position: fixed;
      top: ${iconTop}px;
      left: ${iconLeft}px;
      width: ${iconSize}px;
      height: ${iconSize}px;
      background: rgba(59, 130, 246, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      cursor: pointer;
      z-index: 1002;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px);
      transition: all 0.2s ease;
    `
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536l-7.5 7.5a2 2 0 01-.878.513l-3.39.847a.5.5 0 01-.606-.606l.848-3.39a2 2 0 01.513-.878l7.5-7.5zm-6.732 9.732l-4.232 4.232a2.121 2.121 0 003 3l4.232-4.232" />
      </svg>
    `
    icon.title = 'Resize Google Drive Preview'
      // Hover effects
    icon.addEventListener('mouseenter', () => {
      icon.style.background = 'rgba(37, 99, 235, 0.95)'
      icon.style.transform = 'scale(1.1)'
    })
    
    icon.addEventListener('mouseleave', () => {
      icon.style.background = 'rgba(59, 130, 246, 0.9)'
      icon.style.transform = 'scale(1)'
      
      // Check if we should hide the icon when mouse leaves
      setTimeout(() => {
        const isStillHoveringIframe = iframe.matches(':hover')
        const hasOpenToggle = currentFloatingToggle !== null
        
        if (!isStillHoveringIframe && !hasOpenToggle) {
          removeGdriveFloatingIcon()
        }
      }, 300)
    })
    
    // Click handler
    icon.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Google Drive icon clicked')
      createGdriveFloatingToggle(iframe, editor)
    })
    
    document.body.appendChild(icon)
    currentGdriveIcon = icon
    
    return icon
  }

  const removeGdriveFloatingIcon = () => {
    if (currentGdriveIcon) {
      currentGdriveIcon.remove()
      currentGdriveIcon = null
    }
  }
  const createGdriveFloatingToggle = (iframe, editor = null) => {
    // Remove existing toggle and icon
    removeFloatingToggle()
    removeGdriveFloatingIcon()
    
    const rect = iframe.getBoundingClientRect()
    const currentWidth = parseInt(iframe.getAttribute('width') || '640', 10)
    const currentHeight = parseInt(iframe.getAttribute('height') || '480', 10)

    // Get editor boundaries and toolbar to constrain the toggle position
    const editorElement = iframe.closest('.tiptap-editor') || iframe.closest('.ProseMirror') || iframe.closest('[data-editor]')
    const editorToolbar = editorElement?.querySelector('.tiptap-toolbar') || editorElement?.previousElementSibling?.matches('.tiptap-toolbar') && editorElement.previousElementSibling
    
    // Get editor boundaries
    const editorRect = editorElement ? editorElement.getBoundingClientRect() : { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }
    
    // Get toolbar boundaries and adjust editor top boundary
    const toolbarRect = editorToolbar ? editorToolbar.getBoundingClientRect() : null
    const effectiveEditorTop = toolbarRect ? toolbarRect.bottom : editorRect.top

    const toggle = document.createElement('div')
    toggle.id = 'gdrive-resize-toggle'
    toggle.className = 'gdrive-resize-toggle'
    toggle.style.cssText = `
      position: fixed;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(8px);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      z-index: 1003;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 280px;
      animation: slideIn 0.2s ease-out;
    `

    // Enhanced positioning logic constrained within editor boundaries
    const toggleWidth = 300 // Approximate toggle width
    const toggleHeight = 120 // Approximate toggle height
    const padding = 10

    // Calculate preferred position (above iframe, centered)
    let toggleTop = rect.top - toggleHeight - padding
    let toggleLeft = rect.left + (rect.width / 2) - (toggleWidth / 2)

    // Constrain vertically
    if (toggleTop < editorRect.top + padding) {
      // Not enough space above iframe, try below
      toggleTop = rect.bottom + padding
      
      // If still not enough space below, position at editor bottom
      if (toggleTop + toggleHeight > editorRect.bottom - padding) {
        toggleTop = editorRect.bottom - toggleHeight - padding
      }
    }

    // Constrain horizontally
    if (toggleLeft < editorRect.left + padding) {
      toggleLeft = editorRect.left + padding
    } else if (toggleLeft + toggleWidth > editorRect.right - padding) {
      toggleLeft = editorRect.right - toggleWidth - padding
    }

    // Final boundary checks
    toggleTop = Math.max(editorRect.top + padding, Math.min(toggleTop, editorRect.bottom - toggleHeight - padding))
    toggleLeft = Math.max(editorRect.left + padding, Math.min(toggleLeft, editorRect.right - toggleWidth - padding))
    
    toggle.style.top = `${toggleTop}px`
    toggle.style.left = `${toggleLeft}px`

    // Create toggle content
    toggle.innerHTML = `
      <div style="margin-bottom: 12px;">
        <span style="font-weight: 600; color: #e2e8f0; font-size: 15px;">📺 Google Drive Preview</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-weight: 500; color: #cbd5e1; min-width: 60px;">Width:</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input 
              type="number" 
              id="gdrive-width-input" 
              value="${currentWidth}" 
              min="200" 
              max="1200" 
              step="10"
              style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: white;
                padding: 8px 10px;
                width: 80px;
                font-size: 13px;
                text-align: center;
              "
            />
            <span style="color: #94a3b8;">px</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-weight: 500; color: #cbd5e1; min-width: 60px;">Height:</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input 
              type="number" 
              id="gdrive-height-input" 
              value="${currentHeight}" 
              min="200" 
              max="1000" 
              step="10"
              style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: white;
                padding: 8px 10px;
                width: 80px;
                font-size: 13px;
                text-align: center;
              "
            />
            <span style="color: #94a3b8;">px</span>
          </div>
        </div>        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button 
            id="gdrive-apply-resize" 
            style="
              background: #3b82f6;
              border: none;
              border-radius: 6px;
              color: white;
              padding: 8px 16px;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
              flex: 1;
            "
          >Apply Changes</button>
          <button 
            id="gdrive-close-toggle" 
            style="
              background: rgba(255, 255, 255, 0.1);
              border: none;
              border-radius: 6px;
              color: #94a3b8;
              padding: 8px 12px;
              font-size: 13px;
              cursor: pointer;
              transition: background 0.2s;
            "
          >×</button>
        </div>
      </div>
    `

    document.body.appendChild(toggle)
    currentFloatingToggle = toggle

    // Debug logging and extra event protection for Google Drive toggle
    toggle.addEventListener('click', (e) => {
      console.log('Click inside Google Drive toggle:', e.target.tagName, e.target.className)
      e.stopPropagation() // Prevent event from bubbling up
    })

    // Add specific handlers for input fields to prevent closure
    const inputs = toggle.querySelectorAll('input, button, select, textarea')
    inputs.forEach(input => {
      input.addEventListener('click', (e) => {
        console.log('Click on Google Drive input/button:', e.target.tagName, e.target.id)
        e.stopPropagation() // Extra protection
      })
      
      input.addEventListener('focus', (e) => {
      })
    })

    // Add CSS animation if not exists
    if (!document.querySelector('style[data-image-resize-animation]')) {
      const style = document.createElement('style')
      style.setAttribute('data-image-resize-animation', 'true')
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        #image-resize-toggle input:focus {
          outline: none;
          border-color: #3b82f6 !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        #image-resize-toggle button:hover {
          opacity: 0.8;
        }
        
        #apply-resize:hover {
          background: #2563eb !important;
        }
        
        #close-toggle:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(toggle)
    currentFloatingToggle = toggle

    // Add event listeners
    const widthInput = toggle.querySelector('#gdrive-width-input')
    const heightInput = toggle.querySelector('#gdrive-height-input')
    const applyBtn = toggle.querySelector('#gdrive-apply-resize')
    const closeBtn = toggle.querySelector('#gdrive-close-toggle')

    // Auto-focus the width input
    setTimeout(() => {
      widthInput.focus()
      widthInput.select()
    }, 100)    // Apply resize function
    const applyGdriveResize = () => {
      const newWidth = parseInt(widthInput.value, 10)
      const newHeight = parseInt(heightInput.value, 10)
      
      if (newWidth >= 200 && newWidth <= 1200 && newHeight >= 150 && newHeight <= 1000) {
        console.log('Applying Google Drive resize to:', { width: newWidth, height: newHeight })
        const success = updateGdriveIframeSize(iframe, newWidth, newHeight, editor)
        if (success) {
          // Only remove the toggle, but keep the icon visible for continuous resize
          setTimeout(() => {
            if (currentFloatingToggle) {
              // Clean up outside click listener if it exists
              if (currentFloatingToggle._cleanupOutsideClick) {
                currentFloatingToggle._cleanupOutsideClick()
              }
              
              currentFloatingToggle.remove()
              currentFloatingToggle = null
            }
            
            // Ensure icon is still visible for next resize
            if (!currentGdriveIcon) {
              createGdriveFloatingIcon(iframe, editor)
            }
          }, 200) // Small delay to let update process complete
        }
      } else {
        // Show validation error
        showGdriveResizeError('Invalid dimensions. Width: 200-1200px, Height: 150-1000px')
      }
    }    // Event listeners
    applyBtn.addEventListener('click', applyGdriveResize)
    
    closeBtn.addEventListener('click', () => {
      // Close toggle but keep icon visible for continuous resize
      setTimeout(() => {
        if (currentFloatingToggle) {
          // Clean up outside click listener if it exists
          if (currentFloatingToggle._cleanupOutsideClick) {
            currentFloatingToggle._cleanupOutsideClick()
          }
          
          currentFloatingToggle.remove()
          currentFloatingToggle = null
        }
        
        // Keep the icon visible for user convenience
        if (!currentGdriveIcon && iframe) {
          createGdriveFloatingIcon(iframe, editor)
        }
      }, 100)
    })
    
    // Keyboard events
    widthInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        heightInput.focus()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        removeFloatingToggle()
      }
    })

    heightInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        applyGdriveResize()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        removeFloatingToggle()
      }
    })    // Enhanced outside click detection
    const handleOutsideClick = (e) => {
      // Check if click is inside the toggle element or any of its children
      if (toggle.contains(e.target)) {
        return // Don't close if clicking inside toggle
      }
      
      // Check if click is on the target iframe
      if (iframe.contains(e.target)) {
        return // Don't close if clicking on iframe
      }
      
      // Check if click is on any input, button, or interactive element inside toggle
      if (e.target.matches('input, button, select, textarea') && toggle.contains(e.target)) {
        return // Don't close if clicking on form elements
      }
      
      // Close toggle but maintain icon for continuous resize
      setTimeout(() => {
        if (currentFloatingToggle) {
          // Clean up outside click listener
          if (currentFloatingToggle._cleanupOutsideClick) {
            currentFloatingToggle._cleanupOutsideClick()
          }
          
          currentFloatingToggle.remove()
          currentFloatingToggle = null
        }
        
        // Keep icon visible for user convenience
        if (!currentGdriveIcon && iframe) {
          createGdriveFloatingIcon(iframe, editor)
        }
      }, 100)
    }

    // Prevent toggle content from triggering outside click
    toggle.addEventListener('click', (e) => {
      e.stopPropagation() // Prevent event from bubbling up
    })

    // Add outside click listener with a small delay to avoid immediate closure
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, true) // Use capture phase
      
      // Store cleanup function on toggle element
      toggle._cleanupOutsideClick = () => {
        document.removeEventListener('click', handleOutsideClick, true)
      }
    }, 150) // Increased delay to ensure toggle is fully rendered

    return toggle
  }  // Update Google Drive iframe size
  const updateGdriveIframeSize = (iframe, width, height, editor = null) => {
    
    // Validate dimensions
    if (!width || !height || width < 200 || height < 150 || width > 1200 || height > 1000) {
      console.error('Invalid iframe dimensions:', { width, height })
      showGdriveResizeError('Invalid dimensions. Width: 200-1200px, Height: 150-1000px')
      return false
    }
    
    // Update iframe attributes first (for immediate visual feedback)
    iframe.setAttribute('width', width.toString())
    iframe.setAttribute('height', height.toString())
    
    // Also update style for consistency and ensure proper display
    const currentStyle = iframe.getAttribute('style') || ''
    // Remove any existing width/height from style
    let updatedStyle = currentStyle.replace(/width:\s*\d+px;?/gi, '').replace(/height:\s*\d+px;?/gi, '')
    // Add the new dimensions and ensure max-width is preserved
    updatedStyle = `${updatedStyle}; width: ${width}px; height: ${height}px; max-width: 100%;`.replace(/^;\s*/, '').replace(/;\s*;/g, ';')
    iframe.setAttribute('style', updatedStyle)

    // CRITICAL: Update the editor state to make changes persistent
    if (editor && editor.isEditable) {
      try {
        // Find the iframe node in the editor state and update its attributes
        const { state } = editor
        let iframePos = null
        let iframeNode = null
        
        state.doc.descendants((node, pos) => {
          if (node.type.name === 'iframe') {
            // Check if this is the iframe we're updating by comparing src
            const domIframe = editor.view.nodeDOM(pos)
            if (domIframe === iframe || (domIframe && domIframe.src === iframe.src)) {
              iframePos = pos
              iframeNode = node
              return false // Stop searching
            }
          }
        })
        
        if (iframePos !== null && iframeNode) {
          
          // Create new attributes with updated dimensions
          const newAttrs = {
            ...iframeNode.attrs,
            width: width.toString(),
            height: height.toString(),
            style: updatedStyle
          }
          
          // Create transaction to update the node
          const tr = state.tr.setNodeMarkup(iframePos, null, newAttrs)
          
          // Apply the transaction
          editor.view.dispatch(tr)
          
            // Force editor to emit update event
          setTimeout(() => {
            editor.emit('update', { editor })
              // Re-setup event handlers for the updated iframe to ensure continuous resize capability
            setTimeout(() => {
              setupGdriveIframeHandlers(editor)
              
              // Ensure icon remains visible for continuous resize
              ensureIconVisibility(iframe, editor)
            }, 100)
          }, 50)
          
        } else {
          console.warn('Could not find iframe in editor state, using fallback update')
          // Fallback: Force content sync
          setTimeout(() => {
            forceEditorUpdate(editor)
          }, 100)
        }
        
      } catch (error) {
        console.error('Error updating iframe in editor state:', error)
        // Fallback to force update
        setTimeout(() => {
          forceEditorUpdate(editor)
        }, 100)
      }
    }

    // Show success feedback
    showGdriveResizeSuccess(width, height)
    
    return true
  }
  // Show Google Drive resize success feedback
  const showGdriveResizeSuccess = (width, height) => {
    const feedback = document.createElement('div')
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 1004;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `
    feedback.innerHTML = `📺 Preview resized to ${width}×${height}px<br><small style="opacity: 0.8;">Hover to resize again</small>`

    document.body.appendChild(feedback)

    setTimeout(() => {
      feedback.style.animation = 'slideInRight 0.3s ease-out reverse'
      setTimeout(() => {
        feedback.remove()
      }, 300)
    }, 3000) // Increased duration to show the "hover to resize again" message
  }

  // Show Google Drive resize error
  const showGdriveResizeError = (message) => {
    const error = document.createElement('div')
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      z-index: 1004;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    `
    error.textContent = message

    document.body.appendChild(error)

    setTimeout(() => {
      error.style.animation = 'slideInRight 0.3s ease-out reverse'
      setTimeout(() => {
        error.remove()
      }, 300)
    }, 3000)
  }
  // Force editor to save iframe changes to state
  const forceEditorUpdate = (editor) => {
    if (!editor || !editor.isEditable) return
    
    try {
      
      // Method 1: Get current DOM content and sync to editor if different
      const editorDOMElement = editor.view.dom
      const iframes = editorDOMElement.querySelectorAll('iframe')
      
      if (iframes.length > 0) {
        // Check each iframe and ensure its attributes are in sync with editor state
        iframes.forEach((iframe, index) => {
          const src = iframe.src
          const width = iframe.getAttribute('width')
          const height = iframe.getAttribute('height')
          const style = iframe.getAttribute('style')
          
          // Find corresponding node in editor state
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'iframe' && node.attrs.src === src) {
              // Check if attributes need updating
              const needsUpdate = (
                node.attrs.width !== width ||
                node.attrs.height !== height ||
                node.attrs.style !== style
              )
              
              if (needsUpdate) {
                const newAttrs = {
                  ...node.attrs,
                  width: width,
                  height: height,
                  style: style
                }
                
                const tr = editor.state.tr.setNodeMarkup(pos, null, newAttrs)
                editor.view.dispatch(tr)
              }
              
              return false // Stop after first match
            }
          })
        })
      }
      
      // Method 2: Trigger editor update events
      editor.emit('update', { editor, transaction: editor.state.tr })
      
      // Method 3: Force a transaction to mark content as changed
      const { tr } = editor.state
      const currentTime = Date.now()
      editor.view.dispatch(tr.setMeta('forceUpdate', currentTime))
      
    } catch (error) {
      console.error('Error forcing editor update:', error)
    }
  }

  // Debug function to check iframe state consistency
  const debugIframeState = (editor) => {
    if (!editor) return
    
    console.log('=== IFRAME STATE DEBUG ===')
    
    // Check DOM iframes
    const domIframes = editor.view.dom.querySelectorAll('iframe[src*="drive.google.com"]')
    console.log(`Found ${domIframes.length} Google Drive iframes in DOM:`)
    
    domIframes.forEach((iframe, index) => {
      console.log(`DOM Iframe ${index + 1}:`, {
        src: iframe.src,
        width: iframe.getAttribute('width'),
        height: iframe.getAttribute('height'),
        style: iframe.getAttribute('style'),
        actualWidth: iframe.offsetWidth,
        actualHeight: iframe.offsetHeight
      })
    })
    
    // Check editor state iframes
    let stateIframeCount = 0
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'iframe' && node.attrs.src && node.attrs.src.includes('drive.google.com')) {
        stateIframeCount++
        console.log(`State Iframe ${stateIframeCount}:`, {
          pos: pos,
          attrs: node.attrs
        })
      }
    })
    
    console.log(`Found ${stateIframeCount} Google Drive iframes in editor state`)
    console.log('=== END DEBUG ===')
  }

  // Enhanced function to detect and setup Google Drive iframe handlers
  const setupGdriveIframeHandlers = (editor) => {
    if (!editor) return

    const editorElement = editor.view.dom
    if (!editorElement) return

    // Function to add floating icons to Google Drive iframes
    const addGdriveIcons = () => {
      const iframes = editorElement.querySelectorAll('iframe[src*="drive.google.com"]')
      
      iframes.forEach((iframe) => {
        // Check if icon already exists for this iframe
        const existingIcon = document.querySelector(`[data-iframe-id="${iframe.dataset.iframeId || ''}"]`)
        if (existingIcon) return

        // Set unique identifier
        if (!iframe.dataset.iframeId) {
          iframe.dataset.iframeId = 'gdrive_' + Math.random().toString(36).substr(2, 9)
        }        // Add hover effect to show icon
        iframe.addEventListener('mouseenter', () => {
          if (!currentGdriveIcon && !currentFloatingToggle) {
            createGdriveFloatingIcon(iframe, editor)
          }
        })

        iframe.addEventListener('mouseleave', (e) => {
          // Only remove icon if not hovering over the icon itself AND no toggle is open
          const iconElement = document.getElementById('gdrive-resize-icon')
          const isHoveringIcon = iconElement && iconElement.contains(e.relatedTarget)
          const hasOpenToggle = currentFloatingToggle !== null
          
          if (!isHoveringIcon && !hasOpenToggle) {
            setTimeout(() => {
              // Double check conditions after timeout
              const iconStillExists = document.getElementById('gdrive-resize-icon')
              const stillHoveringIcon = iconStillExists?.matches(':hover')
              const stillHasToggle = currentFloatingToggle !== null
              
              if (!stillHoveringIcon && !stillHasToggle) {
                removeGdriveFloatingIcon()
              }
            }, 300) // Increased timeout for better UX
          }
        })
        
        // Add click handler for direct iframe clicks (alternative way to open toggle)
        iframe.addEventListener('click', (e) => {
          console.log('Google Drive iframe clicked')
          if (e.shiftKey || e.ctrlKey) { // Only on modifier key + click to avoid interfering with normal preview
            e.preventDefault()
            e.stopPropagation()
            
            if (!currentGdriveIcon) {
              createGdriveFloatingIcon(iframe, editor)
            }
            
            // Small delay then show toggle
            setTimeout(() => {
              createGdriveFloatingToggle(iframe, editor)
            }, 100)
          }
        })
      })
    }

    // Initial setup
    addGdriveIcons()

    // Add event listener to track iframe changes
    const handleIframeChanges = (e) => {
      if (e.target.tagName === 'IFRAME' && e.target.src.includes('drive.google.com')) {
        // Trigger editor update
        setTimeout(() => {
          editor.commands.focus()
          const content = editor.getHTML()
          console.log('Editor content after iframe change:', content.includes(e.target.outerHTML))
        }, 200)
      }
    }

    editorElement.addEventListener('DOMSubtreeModified', handleIframeChanges, true)
    editorElement.addEventListener('DOMAttrModified', handleIframeChanges, true)

    // Modern alternative using MutationObserver for attribute changes
    const attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.target.tagName === 'IFRAME' && 
            mutation.target.src.includes('drive.google.com')) {
          console.log('Google Drive iframe attribute changed:', {
            attribute: mutation.attributeName,
            oldValue: mutation.oldValue,
            newValue: mutation.target.getAttribute(mutation.attributeName)
          })
          
          // Force editor update after attribute change
          setTimeout(() => {
            editor.emit('update', { editor })
          }, 100)
        }
      })
    })

    attributeObserver.observe(editorElement, {
      attributes: true,
      attributeOldValue: true,
      subtree: true,
      attributeFilter: ['width', 'height', 'style']
    })

    return () => {
      observer.disconnect()
      attributeObserver.disconnect()
      editorElement.removeEventListener('DOMSubtreeModified', handleIframeChanges, true)
      editorElement.removeEventListener('DOMAttrModified', handleIframeChanges, true)
      removeGdriveFloatingIcon()
    }
  }

  // Enhanced position update function for floating elements  // Helper function to find tiptap toolbar and content areas
  const findEditorAreas = (element) => {
    // Find the editor container first
    const editorContainer = element?.closest('.tiptap-editor')
    if (!editorContainer) return null

    // Find toolbar - it should be the first child or nearby
    const toolbar = editorContainer.querySelector('.tiptap-toolbar') || 
                   [...editorContainer.children].find(child => child.matches('.tiptap-toolbar'))
    
    // Find the actual editor content area (ProseMirror instance)
    const contentArea = editorContainer.querySelector('.ProseMirror') || 
                       editorContainer.querySelector('.tiptap-content')

    return {
      container: editorContainer,
      toolbar: toolbar,
      content: contentArea
    }
  }

  const updateFloatingElementPosition = (element, targetElement, editorElement) => {
    if (!element || !targetElement || !editorElement) return

    // Find editor areas including toolbar and content
    const editorAreas = findEditorAreas(editorElement)
    if (!editorAreas) return

    const rect = targetElement.getBoundingClientRect()
    const editorRect = editorAreas.container.getBoundingClientRect()
    const toolbarRect = editorAreas.toolbar.getBoundingClientRect()
    const contentRect = editorAreas.content.getBoundingClientRect()
    
    // Calculate visible area of target element within editor content
    const visibleRect = {
      top: Math.max(rect.top, contentRect.top),
      bottom: Math.min(rect.bottom, contentRect.bottom),
      left: Math.max(rect.left, contentRect.left),
      right: Math.min(rect.right, contentRect.right)
    }
    
    // Check if target is sufficiently visible (at least 30% height visible)
    const targetHeight = rect.bottom - rect.top
    const visibleHeight = Math.max(0, visibleRect.bottom - visibleRect.top)
    const visibilityRatio = targetHeight > 0 ? visibleHeight / targetHeight : 0
    
    // Hide element if target is not sufficiently visible
    if (visibilityRatio < 0.3) {
      element.style.display = 'none'
      return
    } else {
      element.style.display = 'flex'
    }
    
    // The minimum top position should be just below the toolbar
    const minTop = toolbarRect.bottom + 8 // 8px padding below toolbar
    const maxTop = contentRect.bottom - 32 // Ensure some space at bottom
      // Determine element type and dimensions
    const isIcon = element.id === 'gdrive-resize-icon'
    const isGdriveToggle = element.id === 'gdrive-resize-toggle'
    
    // Calculate dimensions and space requirements
    let elementWidth, elementHeight, padding = 8
    
    if (isIcon) {
      elementWidth = 24
      elementHeight = 24
      padding = 8 // smaller padding for icon
    } else if (isGdriveToggle) {
      elementWidth = 300
      elementHeight = 120
      padding = 12 // larger padding for toggle
    } else {
      elementWidth = 220
      elementHeight = 70
      padding = 10 // medium padding for image toggle
    }
      // Safety distances
    const toolbarSafetyMargin = 8;    let newTop, newLeft

    if (isIcon) {
      // For icon, position it within the visible area of the target
      // Use the visible portion of the target as reference
      const iconTargetTop = Math.max(visibleRect.top, minTop)
      const iconTargetLeft = Math.max(visibleRect.left, contentRect.left + padding)
      
      newTop = iconTargetTop + padding
      newLeft = iconTargetLeft + padding
      
      // Ensure icon stays within content bounds
      newLeft = Math.min(newLeft, contentRect.right - elementWidth - padding)
      newTop = Math.min(newTop, maxTop - elementHeight)
      
      // Final safety check - never above toolbar
      newTop = Math.max(newTop, minTop)    } else {
      // For toggles, use visible area as reference
      const toggleTargetCenterX = (visibleRect.left + visibleRect.right) / 2
      newLeft = toggleTargetCenterX - (elementWidth / 2)
      
      // Try positioning above the visible area first
      newTop = visibleRect.top - elementHeight - padding
      
      // If that would intersect with toolbar, position below visible area
      if (newTop < minTop) {
        newTop = visibleRect.bottom + padding
        
        // If that goes below content area, position just below toolbar
        if (newTop > maxTop - elementHeight) {
          newTop = minTop
        }
      }
      
      // Ensure toggle stays within content bounds horizontally
      newLeft = Math.max(contentRect.left + padding, newLeft)
      newLeft = Math.min(newLeft, contentRect.right - elementWidth - padding)
      
      // Final vertical constraints
      newTop = Math.max(newTop, minTop) // Never above toolbar
      newTop = Math.min(newTop, maxTop - elementHeight) // Never below content
    }

    // Apply smooth transition
    element.classList.add('repositioning')
    element.style.top = `${newTop}px`
    element.style.left = `${newLeft}px`
    
    // Remove transition class after animation
    setTimeout(() => {
      element.classList.remove('repositioning')
    }, 200)
  }
  // Setup scroll handlers to update floating element positions
  const setupScrollHandlers = (editor) => {
    if (!editor) return

    const editorElement = editor.view.dom
    if (!editorElement) return

    // Find the actual scrollable container
    const scrollContainer = editorElement.closest('.tiptap-content') || 
                           editorElement.closest('.ProseMirror') || 
                           editorElement.parentElement?.querySelector('.tiptap-content') ||
                           editorElement

    let scrollTimeout = null

    const handleEditorScroll = (event) => {
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Debounce scroll updates for better performance
      scrollTimeout = setTimeout(() => {
        // Update Google Drive icon position if visible
        if (currentGdriveIcon) {
          const iframe = document.querySelector('iframe[src*="drive.google.com"]')
          if (iframe) {
            const editorElement = iframe.closest('.tiptap-editor') || iframe.closest('.ProseMirror')
            const editorAreas = findEditorAreas(editorElement)
            
            if (editorAreas) {
              const rect = iframe.getBoundingClientRect()
              const contentRect = editorAreas.content.getBoundingClientRect()
              
              // Check visibility based on editor scroll position
              const visibleHeight = Math.max(0, Math.min(rect.bottom, contentRect.bottom) - Math.max(rect.top, contentRect.top))
              const totalHeight = rect.bottom - rect.top
              const visibilityRatio = totalHeight > 0 ? visibleHeight / totalHeight : 0
              
              if (visibilityRatio < 0.3) {
                // Hide icon if not sufficiently visible
                currentGdriveIcon.style.display = 'none'
              } else {
                // Update position
                currentGdriveIcon.style.display = 'flex'
                updateFloatingElementPosition(currentGdriveIcon, iframe, editorElement)
              }
            }
          }
        }

        // Update toggle position if visible
        if (currentFloatingToggle) {
          let targetElement = null
          
          if (currentFloatingToggle.id === 'gdrive-resize-toggle') {
            targetElement = document.querySelector('iframe[src*="drive.google.com"]')
          } else if (currentFloatingToggle.id === 'image-resize-toggle') {
            targetElement = document.querySelector('figure.image')
          }
          
          if (targetElement) {
            const editorElement = targetElement.closest('.tiptap-editor') || targetElement.closest('.ProseMirror')
            if (editorElement) {
              updateFloatingElementPosition(currentFloatingToggle, targetElement, editorElement)
            }
          }
        }
      }, 16) // ~60fps for smooth updates
    }

    // Add scroll listener only to the editor's scroll container
    scrollContainer.addEventListener('scroll', handleEditorScroll, { passive: true })

    // Return cleanup function
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollContainer.removeEventListener('scroll', handleEditorScroll)
    }
  }

  // Setup resize handlers to update floating element positions on window resize
  const setupResizeHandlers = (editor) => {
    if (!editor) return

    let resizeTimeout = null

    const handleResize = () => {
      // Clear previous timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      // Debounce resize updates
      resizeTimeout = setTimeout(() => {
        const editorElement = editor.view.dom
        if (!editorElement) return

        // Update icon position if visible
        if (currentGdriveIcon) {
          const iframe = document.querySelector('iframe[src*="drive.google.com"]')
          if (iframe) {
            updateFloatingElementPosition(currentGdriveIcon, iframe, editorElement)
          }
        }

        // Update toggle position if visible
        if (currentFloatingToggle) {
          let targetElement = null
          
          if (currentFloatingToggle.id === 'gdrive-resize-toggle') {
            targetElement = document.querySelector('iframe[src*="drive.google.com"]')
          } else if (currentFloatingToggle.id === 'image-resize-toggle') {
            targetElement = document.querySelector('figure.image')
          }
          
          if (targetElement) {
            updateFloatingElementPosition(currentFloatingToggle, targetElement, editorElement)
          }
        }
      }, 100) // Slightly longer debounce for resize
    }

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Return cleanup function
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      window.removeEventListener('resize', handleResize)
    }
  }

  // Helper function to ensure icon remains visible for continuous resize
  const ensureIconVisibility = (iframe, editor) => {
    if (!iframe || !editor) return
    
    // Check if iframe is currently hovered or has active interaction
    const isIframeHovered = iframe.matches(':hover')
    const hasActiveToggle = currentFloatingToggle !== null
    const hasExistingIcon = currentGdriveIcon !== null
    
    // Show icon if iframe is being interacted with or if it should remain visible
    if ((isIframeHovered || hasActiveToggle) && !hasExistingIcon) {
      createGdriveFloatingIcon(iframe, editor)
    }
  }

  return {
    setupImageResizeHandlers,
    startResize,
    showPercentageIndicator,
    hidePercentageIndicator,
    createFloatingToggle,
    removeFloatingToggle,
    updateFigureWidth,
    setupGdriveIframeHandlers,
    createGdriveFloatingIcon,
    removeGdriveFloatingIcon,
    createGdriveFloatingToggle,
    updateGdriveIframeSize,
    forceEditorUpdate,
    setupScrollHandlers,
    updateFloatingElementPosition,
    setupResizeHandlers,
    debugIframeState,
    ensureIconVisibility
  }
}
