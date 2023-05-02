import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import ListPo from '../components/DMR/listPO/ListPo';
import POSearch from '../components/DMR/poSearch/POSearch';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { sortedData } from '../interface';
import styles from '../styles/dmr.module.css';
import { NextPageWithLayout } from './page';

interface errorProps {
  error: boolean | null;
  errMessage: string | null;
}

const DMR: NextPageWithLayout = () => {
  const [id, setId] = useState('');
  const [show, setShow] = useState<boolean>(true);
  // const [reFetch, setReFetch] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(true);
  const [detail, setDetail] = useState<sortedData | null>(null);
  const [error, setError] = useState<errorProps>({
    error: false,
    errMessage: '',
  });
  // const [error, setError] = useState(false)
  const [po, setPo] = useState<sortedData[]>([]);
  const [sortType, setSortType] = useState<string>('Default');

  useEffect(() => {
    document.title = 'Raise DMR';
    setShow(false);

    const fetchAllPo = async () => {
      try {
        const response = await axios.get(`${config.SERVER_URL}getAllItems`);

        let sortedData: sortedData[] = [];
        if (sortType === 'Default') {
          sortedData = response.data?.map((d: sortedData, index: number) => ({
            ...d,
            id: index + 1,
          }));
        } else if (sortType === 'Oldest') {
          sortedData = response.data
            ?.sort((a: sortedData, b: sortedData) => {
              return a.date.localeCompare(b.date);
            })
            ?.map((d: sortedData, index: number) => ({
              ...d,
              id: index + 1,
            }));
        } else if (sortType === 'Latest') {
          sortedData = response.data
            ?.sort((a: sortedData, b: sortedData) => {
              return b.date.localeCompare(a.date);
            })
            ?.map((d: sortedData, index: number) => ({
              ...d,
              id: index + 1,
            }));
        }
        setPo(sortedData);
        console.log(sortedData)
        setId('');
        setDetail(null);
      } catch (err: any) {

        console.log(err);
        setError((prev) => ({ ...prev, error: true, errMessage: err.message }));
      }
    };
    console.log(error);
    fetchAllPo()

  }, [sortType, error]);

  const handlesubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let idNo: string = e.target.value as string;
    if (idNo.length === 0) {
      setDetail(null);
      setShow(false);
      console.log(!show);
    } else {
      setShow(true);
      axios
        .get(`${config.SERVER_URL}getdetails/${idNo}`)
        .then((d) => {
          console.log('aws', d.data);
          setDetail(d.data);
        })
        .catch((err) => {
          setDetail(null);
          setFound(false);
          console.log('Error', err.message);
        });
    }
  };

  return (
    <Container>
      <div className={`text-center my-4 ${styles.files} ${styles.toolbar}`}>
        <div
          className={styles.search}
          style={{
            width: ' 100%',
          }}
        >
          {error.error == false ? (
            <>
              <i className="fa fa-search" />
              <input
                type="text"
                className={styles.formControl}
                placeholder="Enter PO number here."
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  handlesubmit(e);
                }}
              />
            </>
          ) : (
            <>
              <i className="fa fa-search" />
              <input
                type="text"
                className={styles.formControl}
                placeholder="Enter PO number here."
                value={id}
                disabled
              />
            </>
          )}
        </div>
        {po.length ? (<>
          <Dropdown
            className={`btn btn-outline-dark ${styles.dropdown}`}>
            <Dropdown.Toggle className=' dropdown-toggle'
              variant='outline'
            >
              Sort By : {sortType}

            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu dropdown-menu-light">
              <Dropdown.Item className="dropdown-item" onClick={() => {
                setSortType('Latest');
              }}
              >
                Latest</Dropdown.Item>
              <Dropdown.Item className="dropdown-item" onClick={() => {
                setSortType('Oldest');
              }}
              >
                Oldest</Dropdown.Item>
              <Dropdown.Item className="dropdown-item"
                onClick={() => {
                  setSortType('Default');
                }}
              >
                None</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
        ) : null}
      </div>

      {!detail ? (
        <>
          <>
            {!found &&
              (show ? (
                <h3 className={styles.notFound}>No Data Found.</h3>
              ) : null)}

            {po.length && !show ? (
              <ListPo poDetails={po} />
            ) : po ? (
              <>
                {error.error == false ? (
                  <h2>Loading...</h2>
                ) : (
                  <Container className="dflex align-items-center justify-content-center">
                    <h2>Some thing went wrong. </h2>
                    <p>
                      Po details can&apos;t fetch. Due to {error.errMessage}
                    </p>
                    <button>retry.</button>
                  </Container>
                )}
              </>
            ) : null}
          </>
        </>
      ) : (
        <div className="pt-3 mt-4">
          <POSearch details={detail} />
        </div>
      )}
    </Container>
  );
};

export default DMR;
DMR.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
