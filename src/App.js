import { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader"

/*
const data = [
  {
    id: 1,
    title: "test 1",
  },
  {
    id: 2,
    title: "test 2",
  },
  {
    id: 3,
    title: "test 3",
  },
  {
    id: 4,
    title: "test 4",
  },
];
*/

const AutocompleteLoader = () => (
  <ContentLoader 
  speed={2}
  width={500}
  height={60}
  viewBox="0 0 500 60"
  backgroundColor="#f3f3f2525253"
  foregroundColor="#212121"
  style={{ marginBottom : '10px'}}
>
  <rect x="84" y="22" rx="3" ry="3" width="88" height="6" /> 
  <rect x="84" y="34" rx="3" ry="3" width="52" height="6" /> 
  <rect x="0" y="72" rx="3" ry="3" width="380" height="6" /> 
  <rect x="0" y="87" rx="3" ry="3" width="178" height="6" /> 
  <rect x="15" y="5" rx="2" ry="2" width="61" height="54" />
  </ContentLoader>
)

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef()

  // Aramaya birden fazla boşluk yapıldığında tek bir boşluğa çevirilir. (Result list açılmayacak)
  const isTyping = search.replace(/\s+/, '').length > 0

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Dropdown list dışına tıkladığında kapanır.
  const handleClickOutside = (e) => {

     // Tıkladığım eleman search div değil ise..
     if(!searchRef.current.contains(e.target)){
        setSearch('')
     }
  }

  const getResultItem = (item) => {
    console.log(item)
  }

  useEffect(() => {
    if (isTyping) {
      
      /*
      const filteredResult = data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      setResult(filteredResult.length > 0 ? filteredResult : false);
      */

      setLoading(true)

      const getData = setTimeout(() => {
        fetch(`https://dummyjson.com/users/search?q=${search}`)
        .then(res => res.json())
        .then(data => {
          setResult(data.users.length > 0 ? data.users : false)
          setLoading(false)
        })

      }, 500);
  
      return () => {
        clearTimeout(getData)
        setLoading(false)
      }
      
    } else {
      setResult(false)
    }

  }, [search]);

  return (
    <>
      <div className="search" ref={searchRef}>
        <div className="search-head">
          <img src="/logo192.png" width='20px' height='20px' /> 
            <h3>React Autocomplete</h3>
        </div>
        <input
          type="text"
          value={search}
          className={isTyping ? 'typing' : null}
          placeholder="Kullanıcı adı ara..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {isTyping && (
          <div className="search-result">
            {result && loading === false && result.map(item => (
                <div onClick={() => getResultItem(item)} key={item.id} className="search-result-item">
                  <img src={item.image} alt="" />
                  <div>
                    <div className="firstName">{item.firstName}</div>
                    <div className="department">{item.company?.department}</div>
                  </div>
                </div>
            ))}
            {loading && new Array(3).fill().map(() => <AutocompleteLoader /> ) }
            {!result && !loading && (
              <div className="result-not-found">
                "{search}" ile ilgil bir şey bulamadık.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
