# cpisgod.github.io

## 로그인 / 보안 설정 (Firebase Auth)

로그인은 Firebase Auth 이메일/비밀번호입니다. 아래를 **순서대로** 한 번만 설정하세요.

1. 콘솔 → Authentication → 로그인 방법 → **이메일/비밀번호** 사용 설정
2. Authentication → 사용자 → **사용자 추가**로 본인 계정 생성, 목록의 **사용자 UID** 복사
3. (권장) Authentication → 설정 → 사용자 작업 → **계정 생성(가입)** 비활성화
4. `database.rules.json`, `storage.rules`의 `YOUR_UID`를 복사한 UID로 바꾼 뒤 적용
   - Realtime Database → 규칙에 `database.rules.json` 내용 붙여넣고 게시
   - Storage → 규칙에 `storage.rules` 내용 붙여넣고 게시
5. 앱 접속 → 만든 이메일/비밀번호로 로그인

> 규칙은 UID 기준이라 3번을 놓쳐 누군가 가입해도 데이터에는 접근할 수 없습니다.
> 4번 적용 전에 UID를 정확히 확인하세요. 틀리면 본인도 데이터를 못 읽습니다.

## 문서(PDF/DOCX/HWPX) 저장 설정

문서는 Firebase Storage(`docs/`)에 저장되고, 목록은 Realtime DB(`docs`)에 기록됩니다.
처음 한 번 아래를 적용해야 새로고침 후에도 문서가 유지됩니다.

1. **Storage 보안 규칙**: 위 로그인 설정의 4번에서 적용한 `storage.rules`
2. **CORS** (브라우저에서 파일을 내려받기 위해 필요):
   `gsutil cors set cors.json gs://memo-acd0e.firebasestorage.app`

## 문서 뷰어 기능

- **PDF**: 텍스트를 드래그해서 복사할 수 있습니다(pdf.js 텍스트 레이어).
- **HWPX**: 본문, 표(테두리/배경/병합), 그림(PNG/JPG/GIF/BMP), 글자 크기·굵기·색, 문단 정렬을 표시합니다. WMF/EMF 같은 벡터 그림과 도형은 `[그림]`으로 표시됩니다.
- **DOCS 클릭**: 분할화면이 자동으로 켜지고 왼쪽은 메모, 오른쪽은 문서가 열립니다.
- **하이라이트 / 메모**: 문서 텍스트를 드래그하면 색 4종 하이라이트와 `💬 메모` 버튼이 나옵니다. 하이라이트를 클릭하면 메모 수정·색 변경·삭제를 할 수 있고, 상단 `💬 N` 버튼에서 목록으로 볼 수 있습니다. 주석은 Realtime Database의 `annotations/{문서ID}`에 저장되며 기존 DB 규칙(본인 UID)이 그대로 적용됩니다.
