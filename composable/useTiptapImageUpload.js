import { ref } from 'vue'

export const useTiptapImageUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const toast = useToast()

  // Upload image to server
  const uploadImageToServer = async (file) => {
    try {
      isUploading.value = true
      uploadProgress.value = 0

      // Validate file
      if (!file) {
        throw new Error('No file selected')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('image', file)

      const primaryToken = localStorage.getItem('userToken') || localStorage.getItem('auth._token.keycloak')

      // Progress handler
      const updateProgress = (progress) => {
        uploadProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }

      if (!primaryToken) {
        throw new Error('Authentication required. Please login first.')
      }

      // Always use Bearer format
      const headers = {
        'Authorization': primaryToken.toLowerCase().startsWith('bearer ')
          ? primaryToken
          : `Bearer ${primaryToken}`
      }
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl;
      const response = await $fetch(`${apiBaseUrl}/api/artikel/upload`, {
        method: 'POST',
        body: formData,
        headers,
        onUploadProgress: updateProgress
      })

      if (response && response.url) {
        return response.url
      } else {
        throw new Error('Invalid response from server')
      }

    } catch (error) {
      console.error('Image upload error:', error)
      // Show user-friendly error messages
      let errorMessage = 'Failed to upload image'
      if (error.message.includes('401') || error.statusCode === 401) {
        errorMessage = 'Authentication failed. Please login again.'
      } else if (error.message.includes('413') || error.statusCode === 413) {
        errorMessage = 'Image file is too large'
      } else if (error.message.includes('415') || error.statusCode === 415) {
        errorMessage = 'Unsupported image format'
      } else if (error.message.includes('403') || error.statusCode === 403) {
        errorMessage = 'Permission denied. You are not authorized to upload images.'
      } else if (error.message.includes('500') || error.statusCode === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }
      toast.add({
        title: errorMessage,
        color: 'red'
      })
      throw error
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }
  // Handle image upload with editor integration
  const handleImageUpload = async (editor) => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file || !editor) {
          reject(new Error('No file selected or editor not available'))
          return
        }

        try {
          // Note: We don't show loading placeholder anymore to avoid double animation
          // The upload progress will be handled by the uploadProgress reactive ref
          
          // Upload image to server
          const imageUrl = await uploadImageToServer(file)

          // Insert the uploaded image wrapped in a figure element
          editor.commands.setImageWithFigure({ 
            src: imageUrl,
            alt: file.name
          })

          toast.add({
            title: 'Gambar Berhasil Diupload',
            color: 'green'
          })

          resolve(imageUrl)
        } catch (error) {
          // No need to remove loading placeholder since we don't create one
          reject(error)
        }
      }

      input.onerror = () => {
        reject(new Error('File selection cancelled'))
      }
    })
  }
  // Handle drag and drop image upload
  const setupImageDropzone = (editor, dropzoneElement) => {
    if (!dropzoneElement || !editor) return

    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzoneElement.classList.add('drag-over')
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzoneElement.classList.remove('drag-over')
    }

    const handleDrop = async (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzoneElement.classList.remove('drag-over')

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter(file => file.type.startsWith('image/'))

      // Process files sequentially to avoid multiple upload animations
      for (const file of imageFiles) {
        try {
          // Wait for previous upload to complete before starting next one
          const imageUrl = await uploadImageToServer(file)
          
          // Insert the uploaded image wrapped in a figure element
          editor.commands.setImageWithFigure({ 
            src: imageUrl,
            alt: file.name 
          })
        } catch (error) {
          console.error('Drop upload failed:', error)
        }
      }
    }

    // Add event listeners
    dropzoneElement.addEventListener('dragover', handleDragOver)
    dropzoneElement.addEventListener('dragleave', handleDragLeave)
    dropzoneElement.addEventListener('drop', handleDrop)

    // Return cleanup function
    return () => {
      dropzoneElement.removeEventListener('dragover', handleDragOver)
      dropzoneElement.removeEventListener('dragleave', handleDragLeave)
      dropzoneElement.removeEventListener('drop', handleDrop)
    }
  }

  return {
    isUploading,
    uploadProgress,
    uploadImageToServer,
    handleImageUpload,
    setupImageDropzone
  }
}
