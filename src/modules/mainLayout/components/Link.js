import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink, withRouter } from 'react-router-dom';

class Link extends React.Component {
    render() {
        const { to, children, location, target } = this.props;

        const isActive = location.pathname === to;

        const classes = classNames('nav-item', {
            active: isActive
        });

        return (
            <li className={classes}  data-toggle='collapse' data-target={target || '.navbar-collapse'}>
                <RouterLink className='nav-link' to={to ? to : '#'}>{children}{isActive ? ( <span className="sr-only">(current)</span>) : null }</RouterLink>
            </li>
        );
    }
}

export default withRouter(Link);