import React, { useState } from "react";
import { Dropdown, Avatar, Badge, Drawer, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "store/slices/authSlice";
import { removeItem } from "store/slices/cartSlice";
import { ShoppingCartOutlined, LogoutOutlined, DeleteOutlined } from "@ant-design/icons";
import NavItem from "./NavItem";
import Flex from "components/shared-components/Flex";
import styled from "@emotion/styled";
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from "constants/ThemeConstant";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: "Sign Out",
    label: <MenuItemSignOut label="Sign Out" />,
  },
];

export const NavProfile = ({ mode }) => {
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const dispatch = useDispatch();


  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <Flex justifyContent="flex-end" alignItems="center" gap={SPACER[4]}>
      {/* Cart Icon with Badge */}
      <Badge count={totalCartItems} showZero>
        <ShoppingCartOutlined
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={() => setCartDrawerVisible(true)}
        />
      </Badge>

      {/* User Profile Dropdown */}
      <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
        <NavItem mode={mode}>
          <Profile>
            <Avatar src="/img/avatars/thumb-3.jpg" />
            <UserInfo className="profile-text">
              <Name>Peter Wainaina</Name>
              <Title>Frontend Developer</Title>
            </UserInfo>
          </Profile>
        </NavItem>
      </Dropdown>

      {/* Cart Drawer */}
      <Drawer
        title="Your Cart"
        placement="right"
        closable={true}
        onClose={() => setCartDrawerVisible(false)}
        open={cartDrawerVisible}
        width={350}
      >
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: "5px" }}>{item.name}</h4>
                  <p style={{ marginBottom: "2px" }}>Quantity: {item.quantity || 1}</p>
                  <p style={{ marginBottom: "2px", fontWeight: "bold" }}>Total: ${item.price * (item.quantity || 1)}</p>
                </div>
                <Button
                  type="text"
                  icon={<DeleteOutlined style={{ color: "red" }} />}
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "10px" }}>
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button type="primary" block>
              Checkout
            </Button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Drawer>
    </Flex>
  );
};

export default NavProfile;
