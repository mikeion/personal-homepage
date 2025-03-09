'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CV() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Curriculum Vitae</h1>
      
      <p className="lead mb-5">
        View my full academic and professional CV below, or download the PDF version.
      </p>
      
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <a href="/api/cv" download="MikeIon_CV.pdf">
            <Button variant="primary" size="lg">
              Download CV (PDF)
            </Button>
          </a>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <div className="ratio ratio-1x1" style={{ maxHeight: '1200px' }}>
            <iframe 
              src="/api/cv" 
              title="Mike Ion CV" 
              className="border rounded shadow"
              style={{ backgroundColor: 'white' }}
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
} 