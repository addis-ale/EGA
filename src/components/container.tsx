interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full max-w-4xl lg:max-w-7xl flex  justify-between px-3 lg:px-4 mx-auto">
      {children}
    </div>
  );
};
export default Container;
