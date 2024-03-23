import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Utils/Api";

const DeleteZakat = () => {
  const [zakat, setZakat] = useState([]);
  const [totalBerasCount, setTotalBerasCount] = useState(0);
  const [totalUangCount, setTotalUangCount] = useState(0);
  const [totalPriaCount, setTotalPriaCount] = useState(0);
  const [totalWanitaCount, setTotalWanitaCount] = useState(0);
  const [totalAllData, setTotalAllData] = useState(0);
  const [jakartaTime, setJakartaTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editCount, setEditCount] = useState("");
  const [editItem, setEditItem] = useState("");
  const [editGender, setEditGender] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const zakatCollection = collection(db, "datazakat");
      const zakatSnapshot = await getDocs(zakatCollection);
      const zakatData = zakatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const berasCount = zakatData.reduce((total, data) => {
        return data.item === "beras" ? total + parseFloat(data.count) : total;
      }, 0);

      const uangCount = zakatData.reduce((total, data) => {
        return data.item === "uang" ? total + parseFloat(data.count) : total;
      }, 0);

      const priaCount = zakatData.filter(
        (data) => data.gender === "pria"
      ).length;
      const wanitaCount = zakatData.filter(
        (data) => data.gender === "wanita"
      ).length;

      const allDataCount = zakatData.length;

      setTotalBerasCount(berasCount);
      setTotalUangCount(uangCount);
      setTotalPriaCount(priaCount);
      setTotalWanitaCount(wanitaCount);
      setTotalAllData(allDataCount);
      setZakat(zakatData);

      setMaxIndex(Math.ceil(zakatData.length / 10) - 1);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setJakartaTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (time) => {
    const options = {
      timeZone: "Asia/Jakarta",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const formattedTime = time.toLocaleString("id-ID", options);
    const hours = time.getHours();

    let period;
    if (hours >= 5 && hours < 11) {
      period = "Selamat Pagi";
    } else if (hours >= 11 && hours < 15) {
      period = "Selamat Siang";
    } else if (hours >= 15 && hours < 18) {
      period = "Selamat Sore";
    } else {
      period = "Selamat Malam";
    }

    return `${formattedTime} ${period}`;
  };

  const goToNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data?"
    );
    if (!isConfirmed) return;
    try {
      await deleteDoc(doc(db, "datazakat", id));
      setZakat(zakat.filter((data) => data.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleUpdate = (data) => {
    setSelectedData(data);
    setEditedName(data.name);
    setEditGender(data.gender);
    setEditItem(data.item);
    setEditCount(data.count);
    setShowEditForm(true);
  };

  const handleEditNameChange = (event) => {
    setEditedName(event.target.value);
  };

  const handleEditGenderChange = (event) => {
    setEditGender(event.target.value);
  };

  const handleEditItemChange = (event) => {
    setEditItem(event.target.value);
  };

  const handleEditCountChange = (event) => {
    setEditCount(event.target.value);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedData) return;
    // Menampilkan alert konfirmasi sebelum melakukan pembaruan data
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin memperbarui data?"
    );
    if (!isConfirmed) return;
    try {
      await updateDoc(doc(db, "datazakat", selectedData.id), {
        name: editedName,
        gender: editGender,
        item: editItem,
        count: editCount,
        // Add other fields if needed
      });
      const updatedZakatData = zakat.map((item) => {
        if (item.id === selectedData.id) {
          return {
            ...item,
            name: editedName,
            gender: editGender,
            item: editItem,
            count: editCount,
          };
        }
        return item;
      });
      setZakat(updatedZakatData);
      setShowEditForm(false);
      setSelectedData(null);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <a className="link-kembali" href="/">
          &#8592; Kembali
        </a>
        <div className="jam_container">
          <p className="jam">{formatTime(jakartaTime)}</p>
        </div>
        <h1>List Daftar Zakat</h1>
        <p>
          Total Jumblah Beras: <b>{totalBerasCount} Liter</b>
        </p>
        <p>
          Total Jumblah Uang: <b>{formatRupiah(totalUangCount)}</b>
        </p>
        <p>
          Total Jumblah Pria: <b>{totalPriaCount}</b>
        </p>
        <p>
          Total Jumblah Wanita: <b>{totalWanitaCount}</b>
        </p>
        <p>
          Total Semua Data: <b>{totalAllData}</b>
        </p>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Item</th>
            <th>Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {zakat
            .filter((data) =>
              data.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(currentIndex * 10, (currentIndex + 1) * 10)
            .map((data, index) => (
              <tr key={data.id}>
                <td>{currentIndex * 10 + index + 1}</td>
                <td>{data.name}</td>
                <td>{data.gender}</td>
                <td>{data.item}</td>
                <td>{data.count}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </button>
                  <button onClick={() => handleUpdate(data)}>Update</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="navigation">
        <button onClick={goToPrev} disabled={currentIndex === 0}>
          &#8678; Prev
        </button>
        <button onClick={goToNext} disabled={currentIndex === maxIndex}>
          Next &#8680;
        </button>
      </div>
      <footer>
        <p>&copy; 2024 - zakatdasbord By EZ4</p>
      </footer>
      {showEditForm && selectedData && (
        <div className="edit-form">
          <h2>Edit Data Zakat</h2>
          <label>Name:</label>
          <input
            type="text"
            value={editedName}
            onChange={handleEditNameChange}
          />
          <label>Gender:</label>
          <input
            type="text"
            value={editGender}
            onChange={handleEditGenderChange}
          />
          <label>Item:</label>
          <input type="text" value={editItem} onChange={handleEditItemChange} />
          <label>Count:</label>
          <input
            type="text"
            value={editCount}
            onChange={handleEditCountChange}
          />
          <button className="update-button" onClick={handleUpdateSubmit}>
            Update
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteZakat;
