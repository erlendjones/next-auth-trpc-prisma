const ErrorMessage = ({
  message,
  onClick,
}: {
  message: string | null;
  onClick: () => void;
}) => {
  return (
    <div className="alert shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{message}</span>
        <span>
          <a onClick={onClick}> Log in by mail instead</a>
        </span>
      </div>
    </div>
  );
};

export default ErrorMessage;
