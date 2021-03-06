import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";
import Modal from "react-bootstrap/esm/Modal";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email:"",
        password:"",
        confirmPassword:"",
        confirmationCode:"",
    });
    const history = useHistory();
    const { userHasAuthenticated } = useAppContext();
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalResend, setShowModalResend] = useState(false);

    const handleCloseModalResend = () => setShowModalResend(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            if (e.name === 'UsernameExistsException') {
                if (userHasAuthenticated === false) {
                    await Auth.resendSignUp();
                    renderConfirmationForm();
                }
            } else {
                onError(e);
                setIsLoading(false);
            }
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError (e);
            setIsLoading(false);
        }
    }

    async function handleResendConfirmationCode() {
        try {
            await Auth.resendSignUp(fields.email);
            console.log('code resent successfully');
            setShowModalResend(true);
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    function ModalResend(props) {
        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>Code resent successfully</Modal.Body>
                
            </Modal>
        )

    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode" size="lg">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autofocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code.</Form.Text>
                </Form.Group>
                <div className="d-flex justify-content-around">
                    <LoaderButton 
                        block
                        size="lg"
                        onChange={handleResendConfirmationCode()}
                        variant="custom"
                        isLoading={isLoading}
                        >
                        Resend
                    </LoaderButton>
                    <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        variant="custom-success"
                        isLoading={isLoading}
                        disabled={!validateConfirmationForm()}
                        >
                        Verify
                    </LoaderButton>
                </div>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" size="lg">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autofocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                        placeholder="Enter email"
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                        placeholder="Enter password"
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" size="lg">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.confirmPassword}
                        onChange={handleFieldChange}
                        placeholder="Enter password again"
                    />
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <LoaderButton 
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                        variant="custom-success"
                    >
                        Signup
                    </LoaderButton>
                </div>
            </Form>
        );
    }

    <ModalResend show={showModalResend} onHide={handleCloseModalResend}/>

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}