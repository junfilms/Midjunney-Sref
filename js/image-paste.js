// 이미지 붙여넣기 및 드래그앤드롭 기능을 위한 스크립트

document.addEventListener('DOMContentLoaded', function() {
  // 모든 이미지 컨테이너에 이벤트 리스너 추가
  const imageContainers = document.querySelectorAll('.image-container');
  
  imageContainers.forEach(container => {
    // 클립보드에서 붙여넣기 이벤트 처리
    document.addEventListener('paste', function(e) {
      // 현재 포커스된 요소가 이 컨테이너인지 확인
      if (document.activeElement === container || container.contains(document.activeElement)) {
        handlePaste(e, container);
      }
    });
    
    // 컨테이너 클릭 시 포커스 설정
    container.addEventListener('click', function() {
      container.focus();
    });
    
    // 컨테이너에 포커스 가능하도록 설정
    container.setAttribute('tabindex', '0');
    
    // 드래그 앤 드롭 이벤트 처리
    container.addEventListener('dragover', function(e) {
      e.preventDefault();
      container.style.border = '2px dashed #a685e2';
    });
    
    container.addEventListener('dragleave', function(e) {
      e.preventDefault();
      container.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });
    
    container.addEventListener('drop', function(e) {
      e.preventDefault();
      container.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      handleDrop(e, container);
    });
  });
  
  // 붙여넣기 처리 함수
  function handlePaste(e, container) {
    // 클립보드에서 이미지 데이터 가져오기
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const url = URL.createObjectURL(blob);
        displayImage(url, container);
        break;
      }
    }
  }
  
  // 드롭 처리 함수
  function handleDrop(e, container) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0 && files[0].type.indexOf('image') !== -1) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      displayImage(url, container);
    }
  }
  
  // 이미지 표시 함수
  function displayImage(url, container) {
    // 기존 내용 제거
    container.innerHTML = '';
    
    // 새 이미지 생성 및 추가
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    container.appendChild(img);
    
    // 이미지 제거 버튼 추가
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '×';
    removeBtn.className = 'remove-image-btn';
    removeBtn.style.position = 'absolute';
    removeBtn.style.top = '5px';
    removeBtn.style.right = '5px';
    removeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '50%';
    removeBtn.style.width = '25px';
    removeBtn.style.height = '25px';
    removeBtn.style.fontSize = '16px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.display = 'flex';
    removeBtn.style.justifyContent = 'center';
    removeBtn.style.alignItems = 'center';
    
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      resetContainer(container);
    });
    
    container.appendChild(removeBtn);
    
    // 컨테이너 스타일 조정
    container.style.position = 'relative';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = '#2a2a4a';
  }
  
  // 컨테이너 초기화 함수
  function resetContainer(container) {
    container.innerHTML = `
      <div class="image-placeholder">
        <i class="fas fa-image fa-3x mb-2"></i><br>
        이미지를 여기에 드래그하거나 붙여넣기 하세요
      </div>
    `;
  }
});
