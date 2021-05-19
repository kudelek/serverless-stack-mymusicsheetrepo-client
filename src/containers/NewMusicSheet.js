import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewMusicSheet.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function NewMusicSheet() {
    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModalFile, setShowModalFile] = useState(false);
    
    const handleCloseModalFile = () => setShowModalFile(false);
    // eslint-disable-next-line no-unused-vars
    const handleShowModalFile = () => setShowModalFile(true);

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();
      
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            setShowModalFile(true);
            if(!showModalFile)
                return;
        }
      
        setIsLoading(true);
      
        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createMusicSheet({ content, attachment });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
      }

      function ModalFile(props) {
        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>Exceeded maximum file size ( {file.current === null ? 0 : parseInt(file.current.size/1000000)}MB &gt; <u>{config.MAX_ATTACHMENT_SIZE/1000000}MB</u> MAX)</Modal.Body>
            <Modal.Footer>
                <Button variant="custom" onClick={handleCloseModalFile}>Understood</Button>
            </Modal.Footer>
            </Modal>
        )
      }
      
      function createMusicSheet(musicsheet) {
        return API.post("mymusicsheetrepo-api", "/mymusicsheetrepo", {
          body: musicsheet
        });
      }

    return (
        <div className="NewMusicSheet">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="content">
                    <Form.Control
                        value={content}
                        as="textarea"
                        placeholder="Type your note"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="custom"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
                <ModalFile show={showModalFile} onHide={handleCloseModalFile}/>
            </Form>
        </div>
    );
}