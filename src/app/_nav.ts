// contains the list of side bar navigation

export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'User',
    url: '/user',
    icon: 'icon-user',
    children:[
      {name:'Add User',
        url:'/user/add',
        icon:'icon-user'},
      {name:'User List',
        url:'/user/list',
        icon:'icon-user'}
    ]
  },
  {
    name: 'Category',
    url: '/category',
    icon: 'icon-list',
    children:[
      {name:'Add Category',
       url:'/category/add',
       icon:'icon-list'},
      {name:'Category List',
       url:'/category/list',
       icon:'icon-list'}
    ]
  },

];
