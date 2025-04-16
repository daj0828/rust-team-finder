const BASE_URL = 'https://rust-team-finder.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  const userJson = localStorage.getItem("loggedInUser");
  if (!userJson) {
    alert("로그인 후 이용해주세요!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("writeSection").style.display = "block";
  displayPosts();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// 글 작성
async function submitPost(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) return;

  const postData = {
    title,
    content,
    nickname: user.nickname,
    discord: user.discord,
  };

  await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  displayPosts();
}

// 글 불러오기
async function displayPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";

  const res = await fetch(`${BASE_URL}/api/posts`);
  const posts = await res.json();

  postList.innerHTML = posts.map(post => `
    <div class="post">
      <div class="post-header">
        <h3>${post.title}</h3>
        <span class="author">${post.nickname} (${post.discord})</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="timestamp">${new Date(post.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}
