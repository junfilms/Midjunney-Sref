# 미드저니 Sref 모음 - 웹 배포 가이드

이 문서는 미드저니 Sref 모음 이미지 갤러리 프레젠테이션을 웹에 배포하는 방법을 안내합니다.

## 목차
1. [무료 호스팅 서비스 이용하기](#무료-호스팅-서비스-이용하기)
2. [GitHub Pages 이용하기](#github-pages-이용하기)
3. [Netlify 이용하기](#netlify-이용하기)
4. [Vercel 이용하기](#vercel-이용하기)
5. [로컬에서 사용하기](#로컬에서-사용하기)

## 무료 호스팅 서비스 이용하기

### 1. GitHub Pages 이용하기

GitHub Pages는 GitHub 저장소에서 직접 웹사이트를 호스팅할 수 있는 무료 서비스입니다.

1. [GitHub](https://github.com)에 계정이 없다면 가입합니다.
2. 새 저장소(repository)를 생성합니다. 저장소 이름을 `midjourney-sref-gallery`로 지정합니다.
3. 생성된 저장소에 압축 해제한 모든 파일을 업로드합니다.
4. 저장소 설정(Settings)으로 이동합니다.
5. 왼쪽 메뉴에서 'Pages'를 클릭합니다.
6. Source 섹션에서 'main' 브랜치를 선택하고 저장합니다.
7. 몇 분 후, GitHub Pages URL이 표시됩니다 (일반적으로 `https://사용자이름.github.io/midjourney-sref-gallery`).

### 2. Netlify 이용하기

Netlify는 정적 웹사이트를 쉽게 배포할 수 있는 무료 호스팅 서비스입니다.

1. [Netlify](https://www.netlify.com/)에 가입합니다.
2. 대시보드에서 'New site from Git' 버튼을 클릭합니다.
3. GitHub, GitLab, Bitbucket 중 하나를 선택하여 연결합니다.
   - 또는 'Deploy manually' 옵션을 선택하여 ZIP 파일을 직접 업로드할 수 있습니다.
4. 저장소를 선택하거나 ZIP 파일을 드래그 앤 드롭합니다.
5. 배포 설정을 확인하고 'Deploy site' 버튼을 클릭합니다.
6. 몇 분 후, 사이트가 배포되고 URL이 제공됩니다.

### 3. Vercel 이용하기

Vercel은 프론트엔드 프로젝트를 위한 또 다른 무료 호스팅 서비스입니다.

1. [Vercel](https://vercel.com/)에 가입합니다.
2. 대시보드에서 'New Project' 버튼을 클릭합니다.
3. GitHub, GitLab, Bitbucket 계정을 연결하거나 로컬 프로젝트를 업로드합니다.
4. 저장소를 선택하거나 프로젝트 파일을 업로드합니다.
5. 배포 설정을 확인하고 'Deploy' 버튼을 클릭합니다.
6. 몇 분 후, 사이트가 배포되고 URL이 제공됩니다.

## 로컬에서 사용하기

웹 서버 없이 로컬에서 프레젠테이션을 사용하는 방법입니다.

1. 압축 파일(`midjourney_sref_gallery.zip`)을 다운로드합니다.
2. 원하는 위치에 압축을 해제합니다.
3. `index.html` 파일을 웹 브라우저(Chrome, Firefox, Edge 등)로 엽니다.
4. 이제 로컬에서 프레젠테이션을 사용할 수 있습니다.

## 주의사항

- 이미지를 추가하면 로컬에서만 저장됩니다. 웹 서버에 자동으로 업로드되지 않습니다.
- 변경사항을 웹에 반영하려면 파일을 수정한 후 호스팅 서비스에 다시 업로드해야 합니다.
- 로컬에서 사용할 때는 브라우저의 보안 설정에 따라 일부 기능이 제한될 수 있습니다.

---

문의사항이 있으시면 언제든지 문의해 주세요.
