import React from "react";
import axios from "axios";
import "./Search.css";
import Loader from "./loader.gif";
import PageNavigation from "./PageNavigation";
import { BackTop } from "antd";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: {},
      loading: false,
      message: "",
      totalResults: 0,
      totalPages: 0,
      currentPageNo: 0,
      sort: "",
      condition: "",
    };
    this.cancel = "";
  }

  getPageCount = (total, denominator) => {
    const divisible = 0 === total % denominator;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  getStock = (result) => {
    if (result >= 1) {
      return (
        <div key={result.id} className="stock">
          STOCK
        </div>
      );
    }
    return (
      <div key={result.id} className="sstock">
        Without STOCK
      </div>
    );
  };

  fetchSearchResults = (updatedPageNo = "", query, sort, condition) => {
    const pageNumber = updatedPageNo ? `&offset=${updatedPageNo}` : "";
    const searchUrl =
      "http://localhost:3000/api/search?query=" +
      query +
      "&limit=30" +
      pageNumber +
      "&sort=" +
      sort +
      "&condition=" +
      condition;

    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, { cancelToken: this.cancel.token })
      .then((res) => {
        const total = res.data.total;
        const totalPagesCount = this.getPageCount(total, 30);
        const resultNotFoundMsg = !res.data.results.length
          ? "There are no more search results, search another thing"
          : "";
        this.setState({
          results: res.data.results,
          message: resultNotFoundMsg,
          totalResults: total,
          totalPages: totalPagesCount,
          currentPageNo: updatedPageNo,
          loading: false,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({ loading: false, message: "Sending reply..." });
        }
      });
  };

  handleOnInputChange = (event) => {
    const query = event.target.value;
    this.setState({ query, loading: true, message: "" }, () => {
      this.fetchSearchResults(1, query, this.state.sort, this.state.condition);
    });
  };

  handlePageClick = (event, type) => {
    event.preventDefault();
    const updatePageNo =
      "prev" === type
        ? this.state.currentPageNo - 1
        : this.state.currentPageNo + 1;
    if (!this.state.loading) {
      this.setState({ loading: true, message: "" }, () => {
        this.fetchSearchResults(
          updatePageNo,
          this.state.query,
          this.state.sort,
          this.state.condition
        );
      });
    }
  };

  handleSort = (e) => {
    e.preventDefault();
    this.setState(
      {
        loading: true,
        message: "",
        query: this.state.query,
        sort: e.target.value,
      },
      () => {
        this.fetchSearchResults(
          1,
          this.state.query,
          this.state.sort,
          this.state.condition
        );
      }
    );
  };

  handleCondition = (e) => {
    e.preventDefault();
    this.setState(
      {
        loading: true,
        message: "",
        query: this.state.query,
        condition: e.target.value,
      },
      () => {
        this.fetchSearchResults(1, this.state.query, "", this.state.condition);
      }
    );
  };

  renderSearchResults = () => {
    const { results } = this.state;
    if (Object.keys(results).length && results.length) {
      return (
        <div className="results-container">
          {results.map((result) => {
            return (
              <div className="column" key={result.id}>
                <div className="card" key={result.id}>
                  <img
                    className="image"
                    src={result.thumbnail}
                    alt={result.title}
                  />
                  <h4>{result.title}</h4>
                  <h5 className="text">Condition: {result.condition}</h5>
                  <h5 lassName="text">
                    Price: {result.currency_id} ${result.price}
                  </h5>
                  <h6 lassName="text">
                    {this.getStock(result.available_quantity)}
                  </h6>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  render() {
    const { query, loading, message, currentPageNo, totalPages } = this.state;

    const showPrevLink = 1 < currentPageNo;
    const showNextLink = totalPages > currentPageNo;

    return (
      <div className="container">
        {/*Heading*/}
        <h2 className="results-container">Live Search</h2>
        {/*Search Input*/}
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            value={query}
            name="query"
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i className="fa fa-search search-icon" />
        </label>
        {/* Error Message */}
        {message && <p className="message">{message}</p>}
        {/* Loader */}
        <br></br>
        <img
          src={Loader}
          alt="loader"
          className={`search-loading ${loading ? "show" : "hide"}`}
        ></img>
        {/* Filters */}
        <div className="filters">
          <div className="filter">
            {" "}
            <select defaultValue="Sort" onChange={this.handleSort}>
              <option value="">Sort</option>
              <option value="price_asc">Asc</option>
              <option value="price_desc">Desc</option>
            </select>
          </div>
          <div className="filter">
            <select defaultValue="Condition" onChange={this.handleCondition}>
              <option value="">Condition</option>
              <option value="2230284">New</option>
              <option value="2230581">Used</option>
            </select>
          </div>
        </div>
        {/* Navigation */}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={(event) => this.handlePageClick(event, "prev")}
          handleNextClick={(event) => this.handlePageClick(event, "next")}
        />
        {/* Results */}
        {this.renderSearchResults()}
        {/* Navigation */}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={(event) => this.handlePageClick(event, "prev")}
          handleNextClick={(event) => this.handlePageClick(event, "next")}
        />
        <BackTop>
          {" "}
          <div className="backtop">
            {" "}
            <button className="backtop">Go UP</button>
          </div>
        </BackTop>
      </div>
    );
  }
}

export default Search;
