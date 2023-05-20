import "./ConfirmBox.css"

function CustomConfirmBox({show, message, onBlack, onWhite, setShowConfirmBox}) {

    return (
        <>
            <div className="container"
                style={{ visibility: show ? "visible" : "hidden" }}>
                <div className="confirmation-text">
                    {message}
                </div>
                <div className="button-container">
                    <button
                        className="confirm-button"
                        onClick={() => {onBlack(); setShowConfirmBox(false);}}>
                        Black
                    </button>
                    <button
                        className="confirm-button"
                        onClick={() => {onWhite(); setShowConfirmBox(false);}}>
                        White
                    </button>
                </div>
            </div>
            <div className="confirm-bg"
                style={{ visibility: show ? "visible" : "hidden" }}
            />
        </>
    );
}

export default CustomConfirmBox;