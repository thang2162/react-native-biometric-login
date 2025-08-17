# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

# Define paths for generated sources
# When installed as a library, the generated sources will be in the consuming app's build directory
set(GENERATED_SOURCES_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../generated")
set(REACT_RENDERER_DIR "${CMAKE_CURRENT_SOURCE_DIR}/react/renderer/components/BiometricLoginSpec")

# Look for generated sources in multiple possible locations
file(GLOB react_codegen_SRCS CONFIGURE_DEPENDS 
  "*.cpp"
  "${REACT_RENDERER_DIR}/*.cpp"
  "${GENERATED_SOURCES_DIR}/*.cpp"
  "${GENERATED_SOURCES_DIR}/react/renderer/components/BiometricLoginSpec/*.cpp"
)

# If no sources found in the expected locations, try to find them in the consuming app's build directory
if(NOT react_codegen_SRCS)
  # Look for sources in the parent project's build directory
  file(GLOB react_codegen_SRCS CONFIGURE_DEPENDS 
    "${CMAKE_CURRENT_SOURCE_DIR}/../../../../*/jni/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/../../../../*/jni/react/renderer/components/BiometricLoginSpec/*.cpp"
  )
endif()

# Ensure we have at least some sources
if(NOT react_codegen_SRCS)
  message(WARNING "No generated sources found for BiometricLoginSpec. Check codegen configuration.")
  # Create an empty source list to prevent build failure
  set(react_codegen_SRCS "")
endif()

add_library(
  react_codegen_BiometricLoginSpec
  OBJECT
  ${react_codegen_SRCS}
)

target_include_directories(react_codegen_BiometricLoginSpec PUBLIC 
  "."
  "${REACT_RENDERER_DIR}"
  "${GENERATED_SOURCES_DIR}"
  "${GENERATED_SOURCES_DIR}/react/renderer/components/BiometricLoginSpec"
)

target_link_libraries(
  react_codegen_BiometricLoginSpec
  fbjni
  jsi
  # We need to link different libraries based on whether we are building rncore or not, that's necessary
  # because we want to break a circular dependency between react_codegen_rncore and reactnative
  reactnative
)

target_compile_reactnative_options(react_codegen_BiometricLoginSpec PRIVATE)
