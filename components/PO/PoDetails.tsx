import { useState } from 'react';
import style from './PO.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../config.json';
import { Col, Form, Row } from 'react-bootstrap';
import AddRows from './RowAR';
import './PO.module.scss';

interface IInputList {
  po_id: string;
  poname: string;
  projectName: string;
  date: string;
  items: {
    index: number;
    po_description: string;
    amount: string;
  }[];
  filename: string;
}

type props = {
  file: File;
  handleReset: () => void;
  fileName: string;
};
const PoDetails = ({ file, handleReset, fileName }: props) => {
  //initial structre of input details
  const [inputList, setInputList] = useState<IInputList>({
    po_id: '',
    poname: '',
    projectName: '',
    date: '',
    items: [{ index: Math.random(), po_description: '', amount: '' }],
    filename: fileName.replace(/\s+/g, '+'),
  });

  //Adding consecutive rows in particular DMR
  const handleAddRows = () => {
    setInputList({
      ...inputList,
      items: [
        ...inputList.items,
        { index: Math.random(), po_description: '', amount: '' },
      ],
    });
  };

  //Adding consecutive rows in particular DMR
  const handleRemoveRows = (index: number) => {
    setInputList({
      ...inputList,
      items: inputList.items.filter((s, sindex) => index !== sindex),
    });
  };

  //Submit
  const formSubmit = async (e: any) => {
    e.preventDefault();
    //TO DO
    // const requiredFields = ["po_id", "poname", "projectName", "date"];
    // for (let field of requiredFields) {
    //   if (!inputList[field].length) {
    //     alert(`Please fill all mandatory fields.`);
    //     return;
    //   }
    // }

    const { po_id, date, poname, projectName, items } = inputList;
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);
    const data = {
      po_id,
      date,
      poname,
      projectName,
      items,
      filename: file.name,
    };

    try {
      const response = await axios.post(`${config.SERVER_URL}poDetails`, data);
      if (response.status === 200) {
        toast.info('Data Submitted Successfully');
        await axios.post(`${config.SERVER_URL}uploadFile`, formData);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <h3 className="text-center mt-5">Please fill Purchase Order details</h3>
      <br />
      <Form>
        <Form.Group>
          <br />
          <Row>
            <Col className="form__group field">
              <input
                className="text-input form__field"
                type="number"
                placeholder="Enter order number"
                name="ponumber"
                id="ponumber"
                value={inputList.po_id}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, po_id: e.target.value })
                }
              />
              <label htmlFor="ponumber" className="form__label">
                PO Number <span className="star">*</span>
              </label>
            </Col>
            <Col className="form__group field">
              <input
                className="text-input form__field"
                type="text"
                placeholder="Enter PO Name"
                name="poname"
                id="poname"
                value={inputList.poname}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, poname: e.target.value })
                }
              />
              <label htmlFor="poname" className="form__label">
                PO Name <span className="star">*</span>
              </label>
            </Col>
            <Col className="form__group field">
              <input
                className="text-input form__field"
                type="text"
                placeholder="Enter order number"
                name="projectName"
                id="projectName"
                value={inputList.projectName}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, projectName: e.target.value })
                }
              />
              <label htmlFor="ponumber" className="form__label">
                Project Name <span className="star">*</span>
              </label>
            </Col>
            <Col className="form__group field">
              <input
                className="text-input form__field"
                type="date"
                placeholder="Select Date"
                name="date"
                id="date"
                aria-required
                required
                value={inputList.date}
                onChange={(e) =>
                  setInputList({ ...inputList, date: e.target.value })
                }
              />
              <label htmlFor="date" className="form__label">
                Select date <span className="star">*</span>
              </label>
            </Col>
          </Row>
          <br />
        </Form.Group>
        <AddRows
          deleted={handleRemoveRows}
          inputList={inputList}
          setInputList={setInputList}
        />
        <Form.Group className="d-flex justify-content-between" as={Col}>
          <div className=" ">
            <button
              className="mt-3 btn btn-outline-primary"
              onClick={formSubmit}
            >
              Submit
            </button>
            <span style={{ margin: '3px' }} />
            <button
              className="btn btn-outline-danger mt-3"
              type="reset"
              onClick={() => handleReset()}
            >
              Cancel
            </button>
          </div>
          <button
            title="addRows"
            onClick={handleAddRows}
            type="button"
            className="btn btn-outline-primary mt-3 "
            style={{ maxHeight: '40px' }}
          >
            +
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PoDetails;
