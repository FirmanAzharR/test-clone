<template>
  <div class="social-media-badge">
    <!-- Social Media Links -->
    <div v-if="socialLinks.length > 0" class="social-grid">
      <UBadge
        v-for="social in socialLinks"
        :key="social.id"
        :color="getSocialColor(social.id)"
        class="social-badge"
      >
        <div class="social-content">
          <UIcon :name="getSocialIcon(social.id)" class="mr-1" />
          <a :href="social.sosmed" target="_blank" class="social-link">
            {{ formatSocialName(social.id) }}
          </a>
        </div>
      </UBadge>
    </div>

    <!-- Contact Information -->
    <div v-if="hasContactInfo" class="contact-grid">
      <UBadge v-if="email" color="gray" variant="soft" class="contact-badge">
        <div class="contact-content">
          <UIcon name="i-heroicons-envelope" class="mr-1" />
          <span>{{ email }}</span>
        </div>
      </UBadge>
      
      <UBadge v-if="phone" color="gray" variant="soft" class="contact-badge">
        <div class="contact-content">
          <UIcon name="i-heroicons-phone" class="mr-1" />
          <span>{{ phone }}</span>
        </div>
      </UBadge>
      
      <UBadge v-if="fax" color="gray" variant="soft" class="contact-badge">
        <div class="contact-content">
          <UIcon name="i-heroicons-device-phone-mobile" class="mr-1" />
          <span>{{ fax }}</span>
        </div>
      </UBadge>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  social: {
    type: [String, Array, Object],
    default: () => []
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  fax: {
    type: String,
    default: ''
  }
});

// Parse social media data
const socialLinks = computed(() => {
  if (Array.isArray(props.social)) {
    return props.social;
  }
  
  if (typeof props.social === 'string') {
    try {
      return JSON.parse(props.social);
    } catch (e) {
      console.error("Failed to parse social JSON:", e);
      return [];
    }
  }
  
  return [];
});

// Check if any contact info exists
const hasContactInfo = computed(() => {
  return props.email || props.phone || props.fax;
});

// Get appropriate icon for each social platform
const getSocialIcon = (platform) => {
  const icons = {
    youtube: 'i-mdi-youtube',
    instagram: 'i-mdi-instagram',
    facebook: 'i-mdi-facebook',
    twitter: 'i-mdi-twitter',
    linkedin: 'i-mdi-linkedin',
    tiktok: 'i-mdi-tiktok'
  };
  
  return icons[platform.toLowerCase()] || 'i-mdi-web';
};

// Get color for each social platform
const getSocialColor = (platform) => {
  const colors = {
    youtube: 'red',
    instagram: 'pink',
    facebook: 'blue',
    twitter: 'sky',
    linkedin: 'indigo',
    tiktok: 'black'
  };
  
  return colors[platform.toLowerCase()] || 'gray';
};

// Format social media name for display
const formatSocialName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};
</script>

<style scoped>
.social-media-badge {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-grid, .contact-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.social-badge {
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.social-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.contact-badge {
  padding: 0.5rem 0.75rem;
}

.social-content, .contact-content {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.social-link {
  color: inherit;
  text-decoration: none;
}

.social-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .social-grid, .contact-grid {
    flex-direction: column;
    width: 100%;
  }
  
  .social-badge, .contact-badge {
    width: 100%;
  }
}
</style>