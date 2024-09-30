

const PinkButton = ({
  buttonClick,
  label
}) => {
  return (
    <button 
      style={{
        color: "rgb(237, 241, 247",
        background: "rgb(21, 37, 69)",
        border: "none",
        margin: "10px",
        fontSize: 24
      }}
      onClick={buttonClick}
    >
      {label}  
    </button>
  )
}

export default PinkButton;