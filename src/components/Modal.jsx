export default function Modal({ children }) {
  return (
    <div className="z-10 transition-all ease duration-1000 fixed top-0 left-0 bottom-0 right-0 p-8 bg-[rgba(0,0,0,0.1)] backdrop-blur h-full overflow-hidden overflow-y-scroll">
      {children}
    </div>
  );
}
