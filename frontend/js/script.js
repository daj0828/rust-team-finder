const BASE_URL = 'http://localhost:5000';

document.addEventListener("DOMContentLoaded", () => {
  const userJson = localStorage.getItem("loggedInUser");
  if (!userJson) {
    alert("로그인 후 이용해주세요!");
    window.location.href = "login.html";
    return;
  }

  try {
    const user = JSON.parse(userJson);
    if (!user.username) throw new Error("로그인 정보 오류");

    document.getElementById("writeSection").style.display = "block";
    displayPosts();
  } catch (e) {
    console.error(e);
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  }
});

async function submitPost(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) return;

  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // if using auth middleware
    },
    body: JSON.stringify({
      title,
      content,
      nickname: user.nickname,
      discord: user.discord
    })
  });

  if (res.ok) {
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    displayPosts();
  }
}

async function displayPosts() {
  const res = await fetch(`${BASE_URL}/api/posts`);
  const posts = await res.json();
  const postList = document.getElementById("postList");
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
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const user = await res.json();
    // ✅ 여기서 로컬스토리지 저장됨
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // ✅ 여기로 이동
    window.location.href = "index.html"; 
  } else {
    alert("로그인 실패!");
  }
});
