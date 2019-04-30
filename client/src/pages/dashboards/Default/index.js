import React from "react";
import { Container, Row, Col } from "reactstrap";
import FileUpload from "./FileUpload";
import FileList from "./FileList";

const Default = () => (
	<Container fluid className='p-0'>
		<Row>
			<Col lg='12' md='12' className='d-flex'>
				<FileUpload />
			</Col>
			<Col lg='12' md='12' className='d-flex'>
				<FileList />
			</Col>
		</Row>
	</Container>
);

export default Default;
