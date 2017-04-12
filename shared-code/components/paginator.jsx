import React from 'react';
import {Link} from 'react-router';

import * as helpers from '../utils/helpers';

const PAGE_COUNT_AROUND_CURRENT = 2;

export default class Paginator extends React.Component {

  constructor () {
    super();
    this.getLink = this.getLink.bind(this);
  }

  getLink (page) {
    return helpers.getPaginatedLink(this.props.location.pathname, page);
  }

  render () {
    const location = this.props.location;
    const totalPages = Math.ceil(this.props.itemCount / this.props.itemsPerPage);
    const currentPage = parseInt(location.query.page) || 1;
    const firstPage = Math.max(1, currentPage - PAGE_COUNT_AROUND_CURRENT);
    const lastPage = Math.min(currentPage + PAGE_COUNT_AROUND_CURRENT, totalPages);
    return (
      totalPages === 0 ?
        null :
        <div>
          {firstPage === 1 ?
            null :
            <span>
              <Link
                  to={this.getLink(1)}>
                &lt;&lt;
              </Link>
              &nbsp;
            </span>
          }
          {currentPage < firstPage || currentPage > lastPage ?
            null :
            [...Array(lastPage - firstPage + 1).keys()].map(index => index + firstPage).map(page => (
              <span
                  key={page}>
                <Link
                    to={this.getLink(page)}>
                  {page}
                </Link>
                &nbsp;
              </span>
            ))
          }
          {lastPage === totalPages ?
            null :
            <span>
              <Link
                  to={this.getLink(totalPages)}>
                &gt;&gt;
              </Link>
              &nbsp;
            </span>
          }
        </div>
    );
  }

}
