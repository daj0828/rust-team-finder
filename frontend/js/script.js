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
  document.getElementById("searchInput").addEventListener("input", displayPosts);
  displayPosts();
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

function displayPosts() {
  const postList = document.getElementById("postList");
  if (!postList) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();

  const filtered = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchValue) ||
      post.nickname.toLowerCase().includes(searchValue) ||
      post.discord.toLowerCase().includes(searchValue)
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.id - a.id;
    });

  postList.innerHTML = filtered.map(post => `
    <div class="post">
      <div class="post-header">
        <h3>${post.title}${post.pinned ? " 📌" : ""}</h3>
        <span class="author">${post.nickname} (${post.discord})</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="timestamp">${post.timestamp}</div>

      <div>
        <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
        ${isAdmin() ? `
          <button onclick="deletePost(${post.id})">삭제</button>
          <button onclick="togglePin(${post.id})">${post.pinned ? "핀 해제" : "핀 고정"}</button>
        ` : ""}
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

function likePost(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  posts[index].likes++;
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

function deletePost(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const filtered = posts.filter(p => p.id !== postId);
  localStorage.setItem("posts", JSON.stringify(filtered));
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

function isAdmin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user.username === "admin";
}
