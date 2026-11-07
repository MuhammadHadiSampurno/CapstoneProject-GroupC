
<template>
  <div class="community-page">
    <AppNavbar />

    <main class="community-container">
      <section class="community-header">
        <span class="page-label">
          READING COMMUNITY
        </span>

        <h1>Join Komunitas</h1>

        <p>
          Temukan komunitas yang sesuai dengan
          minat membaca kamu.
        </p>
      </section>

      <section class="community-list">
        <article
          v-for="community in communities"
          :key="community.id"
          class="community-card"
          @click="openCommunity(community.id)"
        >
          <div class="community-card-header">
            <div class="community-icon">
              📚
            </div>

            <span class="community-category">
              {{ community.category }}
            </span>
          </div>

          <div class="community-card-content">
            <h2>
              {{ community.name }}
            </h2>

            <p>
              {{ community.description }}
            </p>

            <div class="community-members">
              {{ getMemberCount(community) }} anggota
            </div>
          </div>

          <button
            type="button"
            class="community-button"
            :class="{
              joined: isMember(community.id)
            }"
            @click.stop="toggleMembership(community.id)"
          >
            {{
              isMember(community.id)
                ? 'Leave'
                : 'Join'
            }}
          </button>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

import AppNavbar from '../components/AppNavbar.vue'

import {
  getLoggedInUser
} from '../services/authService'

import {
  getCommunityMemberships,
  joinCommunity,
  leaveCommunity
} from '../services/storageService'

import communityData from '../data/communityData'

export default {
  name: 'Community',

  components: {
    AppNavbar
  },

  setup() {
    const router = useRouter()

    const currentUser = ref(null)

    const communities = ref(
      communityData
    )

    const memberships = ref([])

    onMounted(() => {
      const user = getLoggedInUser()

      if (!user) {
        router.replace('/login')
        return
      }

      if (user.isPremium !== true) {
        router.replace('/premium')
        return
      }

      currentUser.value = user

      memberships.value =
        getCommunityMemberships(user.id)
    })

    function isMember(communityId) {
      return memberships.value.includes(
        communityId
      )
    }

    function getMemberCount(community) {
      const joined =
        isMember(community.id)

      return (
        community.initialMembers +
        (joined ? 1 : 0)
      )
    }

    function toggleMembership(communityId) {
      if (!currentUser.value) {
        router.replace('/login')
        return
      }

      if (isMember(communityId)) {
        leaveCommunity(
          currentUser.value.id,
          communityId
        )

        memberships.value =
          memberships.value.filter(
            id => id !== communityId
          )

        return
      }

      joinCommunity(
        currentUser.value.id,
        communityId
      )

      memberships.value = [
        ...memberships.value,
        communityId
      ]
    }

    function openCommunity(communityId) {
      if (!currentUser.value) {
        router.replace('/login')
        return
      }

      if (!isMember(communityId)) {
        return
      }

      router.push(
        `/community/${communityId}`
      )
    }

    return {
      communities,
      memberships,
      isMember,
      getMemberCount,
      toggleMembership,
      openCommunity
    }
  }
}
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.community-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 54px 24px 72px;
}

/* PAGE HEADER */

.community-header {
  margin-bottom: 38px;
  text-align: center;
}

.page-label {
  display: inline-block;
  margin-bottom: 12px;
  padding: 6px 12px;

  border: 1px solid #dce9f6;
  border-radius: 30px;

  background-color: #edf5fc;
  color: var(--color-primary);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.community-header h1 {
  margin: 0 0 10px;

  color: var(--color-black);

  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.8px;
  line-height: 1.3;
}

.community-header p {
  max-width: 480px;
  margin: 0 auto;

  color: var(--color-gray);

  font-size: 14px;
  line-height: 1.7;
}

/* COMMUNITY GRID */

.community-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

/* COMMUNITY CARD */

.community-card {
  display: flex;
  flex-direction: column;

  min-width: 0;
  padding: 26px;

  background-color: var(--color-white);

  border: 1px solid var(--color-light-gray);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-sm);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.community-card:hover {
  transform: translateY(-3px);

  border-color: #cbdced;

  box-shadow: var(--shadow-md);
}

.community-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 22px;
}

/* COMMUNITY ICON */

.community-icon {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border: 1px solid #e7edf5;
  border-radius: 15px;

  background: linear-gradient(
    145deg,
    #f4f8fd,
    #edf3fa
  );

  font-size: 25px;
}

/* CATEGORY BADGE */

.community-category {
  display: inline-flex;
  align-items: center;

  max-width: 65%;
  padding: 6px 11px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  border: 1px solid #e0ebf7;
  border-radius: 30px;

  background-color: #f1f6fc;
  color: var(--color-primary);

  font-size: 11px;
  font-weight: 600;
}

/* COMMUNITY CONTENT */

.community-card-content {
  flex: 1;
}

.community-card-content h2 {
  margin: 0 0 10px;

  color: var(--color-black);

  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.45;
}

.community-card-content p {
  margin: 0 0 18px;

  color: var(--color-gray);

  font-size: 13px;
  line-height: 1.75;
}

.community-members {
  display: inline-flex;
  align-items: center;

  margin-bottom: 22px;

  color: var(--color-gray);

  font-size: 12px;
  font-weight: 500;
}

/* JOIN / LEAVE BUTTON */

.community-button {
  width: 100%;
  min-height: 42px;

  padding: 10px 16px;

  border: 1px solid #013a90;
  border-radius: 9px;

  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );

  color: var(--color-white);

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.community-button:not(.joined):hover {
  border-color: #002f78;

  background: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );

  box-shadow: 0 4px 12px rgba(1, 58, 144, 0.2);
}

.community-button:active {
  transform: scale(0.985);
}

.community-button:focus-visible {
  outline: 3px solid rgba(0, 69, 189, 0.2);
  outline-offset: 3px;
}

/* JOINED STATE - LEAVE */

.community-button.joined {
  border-color: #d8e2ed;
  background-color: #f5f7fa;
  background-image: none;

  color: transparent;

  background-image: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.community-button.joined:hover {
  border-color: #cbd5e1;
  background-color: #edf1f5;

  background-image: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* TABLET */

@media (max-width: 768px) {
  .community-container {
    padding: 40px 20px 56px;
  }

  .community-header {
    margin-bottom: 30px;
  }

  .community-header h1 {
    font-size: 27px;
  }

  .community-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .community-card {
    padding: 20px;
  }

  .community-card-header {
    margin-bottom: 18px;
  }

  .community-card-content h2 {
    font-size: 17px;
  }
}

/* MOBILE */

@media (max-width: 520px) {
  .community-container {
    padding: 32px 16px 44px;
  }

  .community-header {
    margin-bottom: 26px;
    text-align: left;
  }

  .community-header h1 {
    font-size: 25px;
  }

  .community-header p {
    margin: 0;
    font-size: 13px;
  }

  .community-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .community-card {
    padding: 21px;
  }

  .community-card-header {
    margin-bottom: 17px;
  }

  .community-icon {
    width: 49px;
    height: 49px;
    font-size: 23px;
  }

  .community-card-content h2 {
    font-size: 17px;
  }

  .community-card-content p {
    font-size: 13px;
  }

  .community-button {
    min-height: 43px;
  }
}

/* SMALL MOBILE */

@media (max-width: 360px) {
  .community-container {
    padding-right: 13px;
    padding-left: 13px;
  }

  .community-card {
    padding: 17px;
  }

  .community-header h1 {
    font-size: 23px;
  }

  .community-card-content h2 {
    font-size: 16px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .community-card,
  .community-button {
    transition: none;
  }

  .community-card:hover {
    transform: none;
  }
}
</style>
