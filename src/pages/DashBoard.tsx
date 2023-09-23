import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CalendarIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { Sidebar } from "../components/Sidebar";
import CreateBoard from "../components/BoardCRUD/CreateBoard";
import { Input } from "@material-tailwind/react";
import { Board } from "../types/types";
import { deleteBoardWithId, getAllBoards } from "../utils/apiutils";
import { useQueryParams } from "raviger";
import BoardCard from "../components/BoardCRUD/BoardCard";
import Loader from "../components/Loader";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import EditBoard from "../components/BoardCRUD/EditBoard";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export default function DashBoard(props: { name: string }) {
  const [newBoard, setNewBoard] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [{ search }, setQuery] = useQueryParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const limit = 6;

  const toggleCreateBoard = () => {
    setNewBoard(!newBoard);
  };

  const updateBoardCB = (board: Board) => {
    setBoards((prevBoards) =>
      prevBoards.map((b) => (b.id === board.id ? board : b))
    );
    setEditBoard(false);
    setSelectedBoard(null);
  };

  const formatDate = () => {
    const currentDate = new Date();
    const options = {
      weekday: "long" as const,
      day: "numeric" as const,
      month: "long" as const,
    };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      if (id) {
        setLoading(true);
        await deleteBoardWithId(id);

        const deletedBoardIndex = boards.findIndex((b) => b.id === id);
        if (deletedBoardIndex !== -1) {
          boards.splice(deletedBoardIndex, 1);
          setBoards([...boards]);
        }

        setLoading(false);

        toast.success("Board deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        if (boards.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Error deleting board", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllBoards({
          offset: (currentPage - 1) * limit,
          limit: limit,
        });
        setBoards(res.results);
        setCount(res.count);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, boards.length]);

  const randomColors = [
    "pink",
    "purple",
    "indigo",
    "blue",
    "green",
    "yellow",
    "orange",
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * randomColors.length);
    return randomColors[randomIndex];
  };

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setEditBoard(true);
  };

  const [editBoard, setEditBoard] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow p-4 mt-5">
        <Container>
          <Typography variant="h4" className="mt-2" gutterBottom>
            Hello, {props.name}
          </Typography>
          <div className="flex items-center mb-3 p-1">
            <CalendarIcon className="h-6 w-6 mr-2" />
            <Typography variant="body1" className="text-gray-600 pt-1">
              {formatDate()}
            </Typography>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                onClick={toggleCreateBoard}
              >
                Add Board
              </Button>
            </Grid>
          </Grid>
          <div className="w-85 mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuery({ search: searchString });
              }}
            >
              <Input
                id="search"
                name="search"
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
                crossOrigin={""}
                icon={<SearchIcon className="h-5 w-5" />}
                label="Search"
              />
            </form>
          </div>

          {loading ? (
            <div className="h-screen flex mt-40 justify-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {boards.length > 0 &&
                boards
                  .filter((board) =>
                    board.title
                      .toLowerCase()
                      .includes(search?.toLowerCase() || "")
                  )
                  .map((board, index) => (
                    <BoardCard
                      id={board.id || index}
                      key={board.id || index}
                      title={board.title}
                      description={board.description}
                      color={getRandomColor()}
                      onEdit={() => handleEditBoard(board)}
                      onDelete={() => handleDelete(board.id)}
                    />
                  ))}
            </div>
          )}

          {!loading && (!search || search === "") && boards.length > 0 && (
            <div
              className="flex justify-center items-center fixed bottom-10 left-10 ml-40 right-0 space-x-10"
              style={{ zIndex: 1 }}
            >
              <Button
                variant="text"
                className="flex items-center gap-2 text-lg"
                onClick={() => {
                  setCurrentPage((prevPage) => prevPage - 1);
                }}
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon className="h-6 w-6" /> Previous
              </Button>
              <div className="text-green-300 text-lg">
                <p>
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {currentPage * limit < count ? currentPage * limit : count}
                  </span>{" "}
                  of <span className="font-medium">{count}</span> results
                </p>
              </div>
              <Button
                variant="text"
                className="flex items-center gap-2 text-lg"
                onClick={() => {
                  setCurrentPage((prevPage) => prevPage + 1);
                }}
                disabled={currentPage * limit >= count}
              >
                Next <ArrowRightIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </div>
          )}
        </Container>
      </div>
      {newBoard && (
        <div id="modal-root">
          <CreateBoard open={newBoard} handlerCB={toggleCreateBoard} />
        </div>
      )}
      {editBoard && selectedBoard && (
        <div className="ediboard">
          <EditBoard
            pBoard={selectedBoard}
            updateBoard={updateBoardCB}
            open={editBoard}
            handlerCB={() => setEditBoard(false)}
          />
        </div>
      )}
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
