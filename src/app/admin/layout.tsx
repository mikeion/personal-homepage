'use client';

import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              href="/admin/dashboard" 
              className={pathname === '/admin/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/admin/publications" 
              className={pathname.startsWith('/admin/publications') ? 'active' : ''}
            >
              Publications
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/admin/authors" 
              className={pathname === '/admin/authors' ? 'active' : ''}
            >
              Authors
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/admin/cv-import" 
              className={pathname === '/admin/cv-import' ? 'active' : ''}
            >
              CV Import
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={9} lg={10}>
          {children}
        </Col>
      </Row>
    </Container>
  );
} 