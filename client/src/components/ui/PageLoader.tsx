import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  message?: string;
}

const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        min-h-screen
        items-center
        justify-center
        bg-background/90
        backdrop-blur-md
      "
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-surface
            border
            border-border
            shadow-card
          "
        >
          <LoadingSpinner size={42} />
        </div>

        <p
          className="
            text-sm
            text-text-muted
            animate-pulse
          "
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
