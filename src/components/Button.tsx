import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const variantColors = {
    primary: '#2E7D32',
    secondary: '#1565C0',
    danger: '#D32F2F',
    success: '#388E3C',
  };

  const sizes = {
    small: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14 },
    large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
  };

  const sizeStyle = sizes[size];
  const backgroundColor = variantColors[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#CCCCCC' : backgroundColor,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Button;
