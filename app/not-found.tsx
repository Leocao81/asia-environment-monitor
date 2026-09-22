export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="mt-2 text-ink-500">页面不存在或已被移除。</p>
      <a href="/" className="mt-6 inline-flex btn-primary">返回首页</a>
    </div>
  );
}