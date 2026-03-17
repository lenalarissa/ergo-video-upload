export default function VideoTitle({ setTitle }) {
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title");
      setTitle(title);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col min-h-60 w-full max-w-lg bg-gray-50 border-gray-400 border-2 rounded border-dashed justify-center"
    >
      <div className="flex flex-col gap-2 px-4">
        <label htmlFor="title" className="font-bold">
          Titel:
        </label>
        <p className="text-sm">
          Geben Sie hier einen Titel an, der den Inhalt des Videos, das Sie
          hochladen möchten, beschreibt.
        </p>
        <input
          id="title"
          type="text"
          name="title"
          maxLength="99"
          required
          className="px-2 w-full border border-black"
        ></input>
      </div>
      <div className="flex justify-end px-4 pt-2">
        <button
          type="submit"
          className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-1 px-4 text-xs sm:text-sm cursor-pointer"
        >
          Weiter
        </button>
      </div>
    </form>
  );
}
