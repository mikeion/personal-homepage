'use client';

import Link from 'next/link';
import { Card } from 'react-bootstrap';

const AdminPage = () => {
  return (
    <div>
      <Card className="mb-4">
        <Card.Header as="h5">Publications</Card.Header>
        <Card.Body>
          <p>Manage your research publications.</p>
          <div>
            <Link href="/admin/publications/create" className="btn btn-primary me-2">
              Add Publication
            </Link>
            <Link href="/admin/publications" className="btn btn-outline-secondary me-2">
              View All
            </Link>
            <Link href="/admin/cv-import" className="btn btn-outline-success">
              Import from CV
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPage; 