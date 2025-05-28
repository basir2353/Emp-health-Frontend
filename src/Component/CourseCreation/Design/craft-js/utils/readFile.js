export default function (file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise(
    (resolve) => (reader.onload = (e) => resolve(e.target.result))
  );
}
