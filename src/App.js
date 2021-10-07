import React, { useEffect, useState } from 'react';
import fetchImages from './services/api-service';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import Searchbar from './Components/Searchbar/Searchbar';
import Modal from './Components/Modal/Modal';
import Loader from './Components/Loader/Loader';
import Button from './Components/Button/Button';

const App = () => {
  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const [largeImage, setLargeImage] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // const fetchGallery = () => {
    setShowLoader(true);
    fetchImages(search, 1)
      .then(({ hits, total }) => {
        setGallery(hits);
        setPage(1);
        setTotal(total);
        scrollToDown();
      })
      .catch(error => setError(error))
      .finally(() => setShowLoader(false));
    // };
    // fetchGallery();
  }, [search]);

  useEffect(() => {
    if (page !== 1) {
      setShowLoader(true);
      fetchImages(search, page)
        .then(({ hits, total }) => {
          setGallery(prev => [...prev, ...hits]);

          setTotal(total);
          scrollToDown();
        })
        .catch(error => setError(error))
        .finally(() => setShowLoader(false));
    }
  }, [page]);

  const scrollToDown = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = searchQuery => {
    setSearch(searchQuery);
    // setGallery([]);
    // setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const toggleModal = () => {
    setShowModal(prevModal => !prevModal);
  };

  const handleOpenPicture = largeImage => {
    setLargeImage(largeImage);
    toggleModal();
  };

  const showLoadMore = () => {
    return Math.ceil(total / 12) !== page - 1;
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />

      {error && <p>{error.message}</p>}

      {gallery.length > 0 && <ImageGallery gallery={gallery} openImg={handleOpenPicture} />}

      {showLoader && <Loader />}

      {gallery.length > 0 && !showLoader && showLoadMore() && <Button onClick={loadMore} />}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImage} alt={largeImage} />
        </Modal>
      )}
    </div>
  );
};

export default App;

// class App extends Component {
//   state = {
//     gallery: [],
//     search: '',
//     page: 1,
//     showModal: false,
//     showLoader: false,
//     error: null,
//     largeImage: '',
//     total: 0,
//   };

//   fetchGallery = () => {
//     const { search, page } = this.state;
//     this.setState({ showLoader: true });

//   fetchImages(search, page)
//     .then(({ hits, total }) => {
//       this.setState(prevState => ({
//         gallery: [...prevState.gallery, ...hits],
//         page: prevState.page + 1,
//         total,
//       }));
//       this.scrollToDown();
//     })
//     .catch(error => this.setState({ error }))
//     .finally(() => this.setState({ showLoader: false }));
// };

//   handleFormSubmit = searchQuery => {
//     this.setState({ search: searchQuery, gallery: [], page: 1 });
//   };

//   toggleModal = () => {
//     this.setState(prevState => ({
//       showModal: !prevState.showModal,
//     }));
//   };

//   handleOpenPicture = largeImage => {
//     console.log(largeImage);
//     this.setState({ largeImage });
//     this.toggleModal();
//   };

//   showLoadMore = () => {
//     const { total, page } = this.state;
//     return Math.ceil(total / 12) !== page - 1;
//   };

//   componentDidMount() {
//     this.setState({ showLoader: true });
//     this.fetchGallery();
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const prevQuery = prevState.search;
//     const nextQuery = this.state.search;
//     if (prevQuery !== nextQuery) {
//       this.fetchGallery();
//     }

//     console.log(prevQuery, nextQuery);
//   }
//   render() {
//     const { error, showLoader, showModal, gallery, largeImage } = this.state;
//     const showLoadMore = this.showLoadMore();
//     return (
// <div>
//   <Searchbar onSubmit={this.handleFormSubmit} />

//   {error && <p>{error.message}</p>}

//   {gallery.length > 0 && <ImageGallery gallery={gallery} openImg={this.handleOpenPicture} />}

//   {showLoader && <Loader />}

//   {gallery.length > 0 && !showLoader && showLoadMore && (
//     <Button onClick={this.fetchGallery} />
//   )}

//   {showModal && (
//     <Modal onClose={this.toggleModal}>
//       <img src={this.state.largeImage} alt={this.state.largeImage} />
//     </Modal>
//   )}
// </div>
//     );
//   }
// }
