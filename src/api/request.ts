import axios from "axios";

/**
 * สร้างอินสแตนซ์ของ Axios โดยกำหนด URL หลักเป็นค่าจากตัว env VITE_API_BASEURL.
 * @returns อินสแตนซ์ของ Axios
 */
const create = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
  });
};

const client = create();

export { client as default, create };
