# CMakeLists.txt for react-native-biometric-login
# This library is a TurboModule without C++ code, so we create an empty library

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(LIB_TARGET_NAME react_codegen_biometriclogin)

# Create an empty library to satisfy React Native's autolinking requirements
# This library is a TurboModule without C++ code
add_library(
  ${LIB_TARGET_NAME}
  SHARED
)

# Link with minimal required libraries
target_link_libraries(
  ${LIB_TARGET_NAME}
  fbjni
  jsi
  reactnative
)

# Set compile options
target_compile_options(
  ${LIB_TARGET_NAME}
  PRIVATE
  -fexceptions
  -frtti
  -std=c++20
  -Wall
)
