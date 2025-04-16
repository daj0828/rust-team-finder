document.addEventListener("DOMContentLoaded", () => {
  const userJson = localStorage.getItem("loggedInUser");
  if (!userJson) {
    alert("로그인 후 이용해주세요!");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userJson);
  if (!user || !user.username) {
    alert("로그인 정보가 잘못되었습니다.");
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("writeSection").style.display = "block";
  displayPosts();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      displayPosts(searchInput.value.trim().toLowerCase());
    });
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

function submitPost(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) return;

  const newPost = {
    id: Date.now(),
    title,
    content,
    nickname: user.nickname,
    discord: user.discord,
    timestamp: new Date().toLocaleString(),
    comments: [],
    likes: 0,
    pinned: false
  };

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  displayPosts();
}

function displayPosts(filter = "") {
  const postList = document.getElementById("postList");
  if (!postList) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  // 핀된 글 먼저 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });

  const filtered = sortedPosts.filter(post =>
    post.title.toLowerCase().includes(filter) ||
    post.content.toLowerCase().includes(filter) ||
    post.nickname.toLowerCase().includes(filter)
  );

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  postList.innerHTML = filtered.map(post => `
    <div class="post">
      <div class="post-header">
        <h3>${post.title}</h3>
        <span class="author">${post.nickname} (${post.discord})</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="timestamp">${post.timestamp}</div>
      <div style="display:flex; justify-content: space-between; align-items:center; margin-top: 8px;">
        <button onclick="toggleLike(${post.id})">❤️ ${post.likes}</button>

        ${user.username === "zmxnasd11" ? `
          <div>
            <button onclick="deletePost(${post.id})" style="background:#e74c3c; color:#fff;">삭제</button>
            <button onclick="togglePin(${post.id})">${post.pinned ? '핀 해제' : '상단 고정'}</button>
          </div>
        ` : ''}
      </div>

      <div class="comment-section">
        <h4>댓글</h4>
        <div class="comment-list" id="comments-${post.id}">
          ${post.comments.map(c => `
            <div class="comment"><strong>${c.nickname}</strong>: ${c.text}</div>
          `).join("")}
        </div>
        <form onsubmit="addComment(event, ${post.id})">
          <input type="text" id="comment-${post.id}" placeholder="댓글을 입력하세요" required />
          <button type="submit">댓글 작성</button>
        </form>
      </div>
    </div>
  `).join("");
}

function addComment(event, postId) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  posts[index].comments.push({ nickname: user.nickname, text });
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

function toggleLike(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  posts[index].likes = (posts[index].likes || 0) + 1;
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

function deletePost(postId) {
  if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const updated = posts.filter(p => p.id !== postId);
  localStorage.setItem("posts", JSON.stringify(updated));
  displayPosts();
}

function togglePin(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  posts[index].pinned = !posts[index].pinned;
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}
function toggleWrite() {
  const section = document.getElementById("writeSection");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

