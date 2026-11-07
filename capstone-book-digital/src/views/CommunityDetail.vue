
<template>
  <div class="community-detail-page">
    <AppNavbar />

    <main class="community-detail-container">
      <button
        type="button"
        class="back-button"
        @click="goBack"
      >
        ← Kembali ke Komunitas
      </button>

      <section
        v-if="community"
        class="community-information"
      >
        <div class="community-icon">
          📚
        </div>

        <div class="community-information-content">
          <span class="community-category">
            {{ community.category }}
          </span>

          <h1>{{ community.name }}</h1>

          <p>
            {{ community.description }}
          </p>

          <span class="community-members">
            {{ community.initialMembers + 1 }} anggota
          </span>
        </div>
      </section>

      <section class="create-post-card">
        <h2>Buat Postingan</h2>

        <textarea
          v-model="postContent"
          placeholder="Bagikan sesuatu kepada komunitas..."
          rows="4"
        ></textarea>

        <div class="post-form-footer">
          <span
            v-if="postError"
            class="form-error"
          >
            {{ postError }}
          </span>

          <button
            type="button"
            class="post-button"
            @click="createPost"
          >
            Posting
          </button>
        </div>
      </section>

      <section class="discussion-section">
        <div class="section-title">
          <h2>Diskusi Komunitas</h2>

          <span>
            {{ posts.length }} posting
          </span>
        </div>

        <div
          v-if="posts.length === 0"
          class="empty-state"
        >
          <p>
            Belum ada postingan di komunitas ini.
          </p>
        </div>

        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card"
        >
          <div class="post-header">
            <div class="user-avatar">
              {{ getInitial(post.userName) }}
            </div>

            <div class="post-user">
              <strong>{{ post.userName }}</strong>

              <span>
                {{ formatDate(post.createdAt) }}
              </span>
            </div>
          </div>

          <p class="post-content">
            {{ post.content }}
          </p>

          <div class="comments-section">
            <h3>Komentar</h3>

            <div
              v-if="getPostComments(post.id).length === 0"
              class="no-comment"
            >
              Belum ada komentar.
            </div>

            <div
              v-for="comment in getPostComments(post.id)"
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-avatar">
                {{ getInitial(comment.userName) }}
              </div>

              <div class="comment-content">
                <strong>{{ comment.userName }}</strong>

                <p>
                  {{ comment.content }}
                </p>

                <span>
                  {{ formatDate(comment.createdAt) }}
                </span>
              </div>
            </div>

            <div class="comment-form">
              <input
                v-model="commentInputs[post.id]"
                type="text"
                placeholder="Tulis komentar..."
                @keyup.enter="createComment(post.id)"
              />

              <button
                type="button"
                @click="createComment(post.id)"
              >
                Kirim
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import AppNavbar from '../components/AppNavbar.vue'

import {
  getLoggedInUser
} from '../services/authService'

import {
  getCommunityMemberships,
  getCommunityPosts,
  addCommunityPost,
  getCommunityComments,
  addCommunityComment
} from '../services/storageService'

import communityData from '../data/communityData'

import communityPostData from '../data/communityPostData'

export default {
  name: 'CommunityDetail',

  components: {
    AppNavbar
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    const currentUser = ref(null)

    const community = ref(null)

    const postContent = ref('')

    const postError = ref('')

    const commentInputs = ref({})

    const postsData = ref([])

    const commentsData = ref([])

    const communityId = route.params.id

    const posts = computed(() => {
      return postsData.value
        .filter(
          post =>
            post.communityId === communityId
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
    })

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

      const memberships =
        getCommunityMemberships(user.id)

      if (!memberships.includes(communityId)) {
        router.replace('/community')
        return
      }

      const selectedCommunity =
        communityData.find(
          item => item.id === communityId
        )

      if (!selectedCommunity) {
        router.replace('/community')
        return
      }

      currentUser.value = user

      community.value = selectedCommunity

      postsData.value = [
        ...communityPostData,
        ...getCommunityPosts()
      ]

      commentsData.value =
        getCommunityComments()
    })

    function getPostComments(postId) {
      return commentsData.value.filter(
        comment =>
          comment.postId === postId
      )
    }

    function createPost() {
      postError.value = ''

      const content =
        postContent.value.trim()

      if (!content) {
        postError.value =
          'Postingan tidak boleh kosong.'

        return
      }

      if (!currentUser.value) {
        router.replace('/login')
        return
      }

      const newPost = {
        id: `post-${Date.now()}`,
        communityId,
        userId: currentUser.value.id,
        userName: currentUser.value.name,
        content,
        createdAt:
          new Date().toISOString()
      }

      addCommunityPost(newPost)

      postsData.value = [
        newPost,
        ...postsData.value
      ]

      postContent.value = ''
    }

    function createComment(postId) {
      const content =
        (
          commentInputs.value[postId] ||
          ''
        ).trim()

      if (!content) {
        return
      }

      if (!currentUser.value) {
        router.replace('/login')
        return
      }

      const newComment = {
        id: `comment-${Date.now()}`,
        postId,
        userId: currentUser.value.id,
        userName: currentUser.value.name,
        content,
        createdAt:
          new Date().toISOString()
      }

      addCommunityComment(newComment)

      commentsData.value = [
        ...commentsData.value,
        newComment
      ]

      commentInputs.value = {
        ...commentInputs.value,
        [postId]: ''
      }
    }

    function getInitial(name) {
      if (!name) {
        return '?'
      }

      return name
        .charAt(0)
        .toUpperCase()
    }

    function formatDate(date) {
      return new Intl.DateTimeFormat(
        'id-ID',
        {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      ).format(new Date(date))
    }

    function goBack() {
      router.push('/community')
    }

    return {
      community,
      posts,
      postContent,
      postError,
      commentInputs,
      getPostComments,
      createPost,
      createComment,
      getInitial,
      formatDate,
      goBack
    }
  }
}
</script>

<style scoped>
.community-detail-page {
  min-height: 100vh;
  background: #f6f8fc;
}

.community-detail-container {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 34px 28px 72px;
}

/* BLUE GRADIENT THEME */

:root {
  --community-gradient: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );
}

/* BACK BUTTON */

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 25px;
  padding: 7px 0;
  border: none;
  background: transparent;
  color: #0045bd;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #013a90;
}

.back-button:focus-visible {
  outline: 3px solid rgba(0, 69, 189, 0.18);
  outline-offset: 4px;
  border-radius: 4px;
}

/* COMMUNITY INFORMATION */

.community-information {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 26px;
  padding: 32px;
  border: 1px solid #e9edf3;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(25, 42, 70, 0.035);
}

.community-icon {
  width: 78px;
  height: 78px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5eef8;
  border-radius: 18px;
  background: #f0f6fc;
  font-size: 34px;
}

.community-information-content {
  flex: 1;
  min-width: 0;
}

.community-category {
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 6px 11px;
  border: 1px solid #d9e6f8;
  border-radius: 7px;
  background: #eef4ff;
  color: #013a90;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.community-information-content h1 {
  margin: 0 0 9px;
  color: #202b3c;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.45px;
}

.community-information-content p {
  margin: 0 0 13px;
  color: #667085;
  font-size: 14px;
  line-height: 1.7;
}

.community-members {
  display: inline-flex;
  align-items: center;
  color: #8490a0;
  font-size: 12px;
  font-weight: 500;
}

/* CREATE POST */

.create-post-card {
  margin-bottom: 32px;
  padding: 26px;
  border: 1px solid #e9edf3;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(25, 42, 70, 0.035);
}

.create-post-card h2 {
  margin: 0 0 17px;
  color: #202b3c;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.create-post-card textarea {
  display: block;
  width: 100%;
  min-height: 112px;
  resize: vertical;
  padding: 15px 16px;
  border: 1px solid #e0e6ee;
  border-radius: 11px;
  outline: none;
  background: #fbfcfe;
  color: #344054;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.65;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.create-post-card textarea::placeholder {
  color: #a0a9b7;
}

.create-post-card textarea:hover {
  border-color: #bdc9d8;
}

.create-post-card textarea:focus {
  border-color: #0045bd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 69, 189, 0.08);
}

.post-form-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 15px;
}

.form-error {
  margin-right: auto;
  color: #b42318;
  font-size: 12px;
  line-height: 1.5;
}

/* POST BUTTON */

.post-button {
  min-width: 100px;
  padding: 11px 21px;
  border: 1px solid #013a90;
  border-radius: 9px;
  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.post-button:hover {
  border-color: #002f78;
  background: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );
  box-shadow: 0 4px 11px rgba(1, 58, 144, 0.2);
}

.post-button:active {
  transform: translateY(1px);
}

.post-button:focus-visible,
.comment-form button:focus-visible {
  outline: 3px solid rgba(0, 69, 189, 0.18);
  outline-offset: 3px;
}

/* DISCUSSION SECTION */

.discussion-section {
  width: 100%;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 0;
  color: #202b3c;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
}

.section-title span {
  display: inline-flex;
  align-items: center;
  padding: 6px 11px;
  border: 1px solid #e7ebf1;
  border-radius: 20px;
  background: #ffffff;
  color: #667085;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* EMPTY STATE */

.empty-state {
  padding: 38px 24px;
  border: 1px solid #e9edf3;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 4px 14px rgba(25, 42, 70, 0.025);
}

.empty-state p {
  margin: 0;
  color: #8490a0;
  font-size: 13px;
  line-height: 1.6;
}

/* POST CARD */

.post-card {
  margin-bottom: 20px;
  padding: 25px;
  border: 1px solid #e9edf3;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(25, 42, 70, 0.035);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.post-card:hover {
  border-color: #dce5ef;
  box-shadow: 0 7px 20px rgba(25, 42, 70, 0.055);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 18px;
}

.user-avatar,
.comment-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #d9e6f8;
  border-radius: 50%;
  background: #eef4ff;
  color: #013a90;
  font-weight: 700;
}

.user-avatar {
  width: 43px;
  height: 43px;
  font-size: 15px;
}

.post-user {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.post-user strong {
  overflow-wrap: anywhere;
  color: #344054;
  font-size: 13px;
  font-weight: 700;
}

.post-user span {
  color: #98a2b3;
  font-size: 11px;
}

.post-content {
  margin: 0 0 25px;
  color: #475467;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

/* COMMENTS */

.comments-section {
  padding-top: 21px;
  border-top: 1px solid #edf0f4;
}

.comments-section h3 {
  margin: 0 0 16px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.no-comment {
  margin-bottom: 16px;
  color: #98a2b3;
  font-size: 12px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 13px;
}

.comment-avatar {
  width: 34px;
  height: 34px;
  font-size: 12px;
}

.comment-content {
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #f8fafc;
}

.comment-content strong {
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.comment-content p {
  margin: 5px 0 7px;
  color: #475467;
  font-size: 12px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.comment-content span {
  color: #98a2b3;
  font-size: 10px;
}

/* COMMENT FORM */

.comment-form {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.comment-form input {
  flex: 1;
  min-width: 0;
  min-height: 42px;
  padding: 10px 14px;
  border: 1px solid #e0e6ee;
  border-radius: 9px;
  outline: none;
  background: #fbfcfe;
  color: #344054;
  font-family: inherit;
  font-size: 12px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.comment-form input::placeholder {
  color: #a0a9b7;
}

.comment-form input:hover {
  border-color: #bdc9d8;
}

.comment-form input:focus {
  border-color: #0045bd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 69, 189, 0.08);
}

/* SEND COMMENT BUTTON */

.comment-form button {
  min-height: 42px;
  padding: 10px 17px;
  border: 1px solid #013a90;
  border-radius: 9px;
  background: linear-gradient(
    125deg,
    #0045bd 0%,
    #013a90 48%,
    #0b53c8 100%
  );
  color: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.comment-form button:hover {
  border-color: #002f78;
  background: linear-gradient(
    125deg,
    #003b9f 0%,
    #012e75 48%,
    #0845a9 100%
  );
  box-shadow: 0 4px 10px rgba(1, 58, 144, 0.16);
}

.comment-form button:active {
  transform: translateY(1px);
}

/* TABLET */

@media (max-width: 768px) {
  .community-detail-container {
    padding: 26px 18px 55px;
  }

  .community-information {
    gap: 19px;
    padding: 25px;
  }

  .community-information-content h1 {
    font-size: 22px;
  }

  .create-post-card {
    padding: 22px;
  }

  .post-card {
    padding: 21px;
  }
}

/* MOBILE */

@media (max-width: 520px) {
  .community-detail-container {
    padding: 22px 15px 42px;
  }

  .back-button {
    margin-bottom: 20px;
    font-size: 12px;
  }

  .community-information {
    align-items: flex-start;
    gap: 15px;
    padding: 19px;
    border-radius: 15px;
  }

  .community-icon {
    width: 55px;
    height: 55px;
    border-radius: 13px;
    font-size: 26px;
  }

  .community-information-content h1 {
    font-size: 19px;
  }

  .community-information-content p {
    font-size: 12px;
    line-height: 1.65;
  }

  .community-category {
    margin-bottom: 8px;
    font-size: 10px;
  }

  .community-members {
    font-size: 11px;
  }

  .create-post-card {
    margin-bottom: 26px;
    padding: 19px;
    border-radius: 15px;
  }

  .create-post-card h2 {
    font-size: 16px;
  }

  .create-post-card textarea {
    min-height: 100px;
    padding: 12px;
    font-size: 12px;
  }

  .post-form-footer {
    gap: 10px;
  }

  .post-button {
    min-width: 85px;
    padding: 10px 15px;
    font-size: 12px;
  }

  .section-title h2 {
    font-size: 17px;
  }

  .section-title span {
    font-size: 10px;
  }

  .post-card {
    margin-bottom: 16px;
    padding: 18px;
    border-radius: 15px;
  }

  .post-content {
    font-size: 13px;
  }

  .comments-section {
    padding-top: 18px;
  }

  .comment-form {
    align-items: stretch;
    gap: 8px;
  }

  .comment-form input {
    font-size: 11px;
  }

  .comment-form button {
    padding: 9px 13px;
    font-size: 11px;
  }
}

/* SMALL MOBILE */

@media (max-width: 360px) {
  .community-information {
    gap: 12px;
    padding: 16px;
  }

  .community-icon {
    width: 46px;
    height: 46px;
    font-size: 22px;
  }

  .community-information-content h1 {
    font-size: 17px;
  }

  .post-card {
    padding: 15px;
  }

  .comment-item {
    gap: 8px;
  }

  .comment-content {
    padding: 10px;
  }
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .back-button,
  .create-post-card textarea,
  .post-button,
  .post-card,
  .comment-form input,
  .comment-form button {
    transition: none;
  }
}
</style>
