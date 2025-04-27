let currentFolder = '';
let folders = {};

function openFolderPopup() {
  document.getElementById('folderPopup').style.display = 'flex';
}

function closeFolderPopup() {
  document.getElementById('folderPopup').style.display = 'none';
}

function createFolder() {
  const name = document.getElementById('folderName').value.trim();
  if(!name) return;
  const folderKey = `webdev_${name}`;
  folders[folderKey] = [];
  const folderList = document.getElementById('folderList');
  const div = document.createElement('div');
  div.className = 'folder';
  div.innerText = folderKey;
  div.onclick = (e) => {
    if(e.detail === 1) {
      setTimeout(()=> {
        if(e.detail === 1) openImagePopup(folderKey);
      }, 200);
    }
  }
  div.oncontextmenu = (e) => {
    e.preventDefault();
    if(confirm('Do you want to add more images to this folder?')) openImagePopup(folderKey);
  }
  folderList.appendChild(div);
  closeFolderPopup();
}

function openImagePopup(folderKey) {
  currentFolder = folderKey;
  document.getElementById('imagePopup').style.display = 'flex';
  loadImages();
}

function closeImagePopup() {
  document.getElementById('imagePopup').style.display = 'none';
}

function uploadImage() {
  const fileInput = document.getElementById('screenshot');
  if(fileInput.files.length === 0) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const src = e.target.result;
    folders[currentFolder].push({src, remark: ''});
    loadImages();
  };
  reader.readAsDataURL(fileInput.files[0]);
}

function loadImages() {
  const container = document.getElementById('imageContainer');
  container.innerHTML = '';
  folders[currentFolder].forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'image-box';
    div.innerHTML = `<img src="${img.src}" ondblclick="viewImage(${index})">`;
    container.appendChild(div);
  });
}

function viewImage(index) {
  const imgData = folders[currentFolder][index];
  document.getElementById('popupImage').src = imgData.src;
  const remarkBox = document.getElementById('remarkBox');
  remarkBox.value = imgData.remark;
  remarkBox.oninput = function() {
    imgData.remark = remarkBox.value;
  };
  document.getElementById('viewImagePopup').style.display = 'flex';
}

function closeViewImagePopup() {
  document.getElementById('viewImagePopup').style.display = 'none';
}

// Ensure the imagePopup is displayed correctly
document.addEventListener('DOMContentLoaded', () => {
  let touchCount = 0;

  const folderList = document.getElementById('folderList');

  folderList.addEventListener('touchstart', (e) => {
    touchCount = e.touches.length;
  });

  folderList.addEventListener('touchend', (e) => {
    if (touchCount === 3) {
      const imagePopup = document.getElementById('imagePopup');
      imagePopup.style.display = 'flex'; // Ensure the popup is visible
      document.body.style.filter = 'blur(5px)';
      imagePopup.style.filter = 'none';
    }
    touchCount = 0; // Reset touch count
  });

  const closeImagePopup = () => {
    const imagePopup = document.getElementById('imagePopup');
    imagePopup.style.display = 'none';
    document.body.style.filter = 'none';
  };

  document.getElementById('imagePopup').querySelector('button[onclick="closeImagePopup()"]').onclick = closeImagePopup;
});
