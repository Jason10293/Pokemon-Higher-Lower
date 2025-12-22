type ErrorNoticeProps = {
  message: string;
};

export function ErrorNotice({ message }: ErrorNoticeProps) {
  return (
    <div className="mb-4 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 backdrop-blur">
      {message}
    </div>
  );
}
