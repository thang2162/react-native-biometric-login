require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "BiometricLogin"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/thang2162/react-native-biometric-login.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cp,swift}"
  s.private_header_files = "ios/**/*.h"
  
  # Add header search paths for generated files
  s.pod_target_xcconfig = {
    'HEADER_SEARCH_PATHS' => '"$(PODS_TARGET_SRCROOT)/ios/generated"',
    'SWIFT_VERSION' => '5.0',
    'DEFINES_MODULE' => 'YES',
    'SWIFT_INSTALL_OBJC_HEADER' => 'YES',
    'SWIFT_OBJC_INTERFACE_HEADER_NAME' => 'BiometricLogin-Swift.h'
  }


  install_modules_dependencies(s)
end
