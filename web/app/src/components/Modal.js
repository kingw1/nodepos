function Modal(props) {
  return (
    <>
      <div className="modal" tabIndex="-1" id={props.id}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="btnModalClose"
              ></button>
            </div>
            <div className="modal-body">{props.children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
