import Dropdown from './dropdown';
import Trigger from './trigger';
import Menu from './menu';
import MenuItem from './menu-item';

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.MenuItem = MenuItem;

Dropdown.Trigger.displayName = 'Dropdown.Trigger';
Dropdown.Menu.displayName = 'Dropdown.Menu';
Dropdown.MenuItem.displayName = 'Dropdown.MenuItem';

export default Dropdown;
