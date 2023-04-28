import Link from 'next/link';
import { Nav } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="py-3 ">
      {' '}
      <ul className="nav justify-content-center border-top p-3 mt-4">
        {' '}
        <Nav className="mr-auto ms-2">
          {' '}
          <Link href="/" style={{ color: 'black' }}>
            Home{' '}
          </Link>{' '}
          <Link href="/evc" style={{ color: 'black' }}>
            EV Calculation{' '}
          </Link>{' '}
          <Link href="/dmr" style={{ color: 'black' }}>
            Raise DMR{' '}
          </Link>{' '}
        </Nav>{' '}
      </ul>{' '}
      <p className="text-center" style={{ color: 'black' }}>
        © 2023 Company, Inc{' '}
      </p>{' '}
    </footer>
  );
};

export default Footer;
