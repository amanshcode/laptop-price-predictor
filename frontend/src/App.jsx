import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [options, setOptions] = useState(null);

  const [formData, setFormData] = useState({
    Company: "",
    TypeName: "",
    Ram: "",
    Weight: "",
    Touchscreen: "",
    "IPS Panel": "",
    "Screen Size": "",
    Resolution: "",
    "Cpu brand": "",
    HDD: "",
    SSD: "",
    "Gpu brand": "",
    os: ""
  });

  const [price, setPrice] = useState("");

  useEffect(() => {
    async function getOptions() {
      try {
        const response = await axios.get(`${API_URL}/options`);
        setOptions(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getOptions();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function predictPrice() {

    try {
      if (Object.values(formData).some(value => value === "")) {
        alert("Please fill all fields.");
        return;
      }
      const response = await axios.post(
        `${API_URL}/predict`,
        formData
      );

      setPrice(response.data.price);

    } catch (error) {
      console.log(error);
    }

  }
  if (!options) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container">

      <div className="card">

        <h1>Laptop Price Predictor</h1>

        {/* Brand */}
        <label htmlFor="Company">Brand:</label>
        <select
          name="Company"
          value={formData.Company}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Company
          </option>

          {options.companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* Type */}
        <label htmlFor="TypeName">Type:</label>
        <select
          name="TypeName"
          value={formData.TypeName}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Type
          </option>

          {options.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* RAM */}
        <label htmlFor="Ram">RAM:</label>
        <select
          name="Ram"
          value={formData.Ram}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select RAM
          </option>
          {options.ram.map((ram) => (
            <option key={ram} value={ram}>
              {ram}
            </option>
          ))}
        </select>

        {/* Weight */}
        <label htmlFor="Weight">Weight (in kg):</label>
        <input
          type="number"
          step="0.01"
          name="Weight"
          placeholder="Weight"
          value={formData.Weight}
          onChange={handleChange}
        />

        {/* Touchscreen */}
        <label htmlFor="Touchscreen">Touchscreen:</label>
        <select
          name="Touchscreen"
          value={formData.Touchscreen}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Touchscreen
          </option>
          {options.touchscreen.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* IPS */}
        <label htmlFor="IPS Panel">IPS Panel:</label>
        <select name="IPS Panel" value={formData["IPS Panel"]} onChange={handleChange}>
          <option value="" disabled>
            Select IPS Panel
          </option>

          {options.ips.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Screen Size */}
        <label htmlFor="Screen Size">Screen Size (in inches):</label>
        <input
          type="number"
          step="0.1"
          min={options.screen_size.min}
          max={options.screen_size.max}
          placeholder="Screen Size"
          value={formData["Screen Size"]}
          name="Screen Size"
          onChange={handleChange}
        />

        {/* Resolution */}
        <label htmlFor="Resolution">Resolution:</label>
        <select name="Resolution" value={formData.Resolution} onChange={handleChange}>
          <option value="" disabled>
            Select Resolution
          </option>
          {options.resolution.map((resolution) => (
            <option key={resolution} value={resolution}>
              {resolution}
            </option>
          ))}
        </select>

        {/* CPU */}
        <label htmlFor="Cpu brand">CPU:</label>
        <select name="Cpu brand" value={formData["Cpu brand"]} onChange={handleChange}>
          <option value="" disabled>Select CPU</option>
          {options.cpu.map((cpu) => (
            <option key={cpu} value={cpu}>
              {cpu}
            </option>
          ))}
        </select>

        {/* HDD */}
        <label htmlFor="HDD">HDD:</label>
        <select name="HDD" value={formData.HDD} onChange={handleChange}>
          <option value="" disabled>Select HDD</option>
          {options.hdd.map((hdd) => (
            <option key={hdd} value={hdd}>
              {hdd}
            </option>
          ))}
        </select>

        {/* SSD */}
        <label htmlFor="SSD">SSD:</label>
        <select name="SSD" value={formData.SSD} onChange={handleChange}>
          <option value="" disabled>Select SSD</option>
          {options.ssd.map((ssd) => (
            <option key={ssd} value={ssd}>
              {ssd}
            </option>
          ))}
        </select>

        {/* GPU */}
        <label htmlFor="Gpu brand">GPU:</label>
        <select name="Gpu brand" value={formData["Gpu brand"]} onChange={handleChange}>
          <option value="" disabled>Select GPU</option>
          {options.gpu.map((gpu) => (
            <option key={gpu} value={gpu}>
              {gpu}
            </option>
          ))}
        </select>

        {/* OS */}
        <label htmlFor="os">OS:</label>
        <select name="os" value={formData.os} onChange={handleChange}>
          <option value="" disabled>Select OS</option>
          {options.os.map((os) => (
            <option key={os} value={os}>
              {os}
            </option>
          ))}
        </select>

        <button onClick={predictPrice}>
          Predict Price
        </button>

        {
          price &&
          <h2>₹ {price.toLocaleString()}</h2>
        }

      </div>

    </div>
  );

}

export default App;