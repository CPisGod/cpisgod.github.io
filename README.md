# cpisgod.github.io

## 문서(PDF/DOCX/HWPX) 저장 설정

문서는 Firebase Storage(`docs/`)에 저장되고, 목록은 Realtime DB(`docs`)에 기록됩니다.
처음 한 번 아래 두 가지를 적용해야 새로고침 후에도 문서가 유지됩니다.

1. **Storage 보안 규칙**: Firebase 콘솔 → Storage → 규칙에 `storage.rules` 내용 붙여넣기 (또는 `firebase deploy --only storage`)
2. **CORS** (브라우저에서 파일을 내려받기 위해 필요):
   `gsutil cors set cors.json gs://memo-acd0e.firebasestorage.app`
