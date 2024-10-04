import viteLogo from "/logo.png";

const Header = () => {
  return (
    <header className="header">
      <figure>
        <img src={viteLogo} alt="logo" />
      </figure>
      <span>Json to Excel</span>
    </header>
  );
};

export default Header;
