#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 React Native Biometric Login - Setup Verification\n');

// Check if we're in a React Native project
function checkReactNativeProject() {
  console.log('📱 Checking React Native project setup...');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      '❌ No package.json found. Please run this script from your React Native project root.'
    );
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasReactNative =
      packageJson.dependencies && packageJson.dependencies['react-native'];

    if (!hasReactNative) {
      console.log(
        "❌ React Native not found in dependencies. This doesn't appear to be a React Native project."
      );
      return false;
    }

    console.log(
      `✅ React Native project detected (version: ${packageJson.dependencies['react-native']})`
    );
    return true;
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return false;
  }
}

// Check Android configuration
function checkAndroidSetup() {
  console.log('\n🤖 Checking Android setup...');

  const androidDir = path.join(process.cwd(), 'android');
  if (!fs.existsSync(androidDir)) {
    console.log(
      '❌ Android directory not found. This appears to be an iOS-only project.'
    );
    return false;
  }

  // Check gradle.properties
  const gradlePropsPath = path.join(androidDir, 'gradle.properties');
  if (fs.existsSync(gradlePropsPath)) {
    const gradleProps = fs.readFileSync(gradlePropsPath, 'utf8');
    const hasNewArch = gradleProps.includes('newArchEnabled=true');
    const hasCodegen = gradleProps.includes('codegenEnabled=true');

    console.log(
      `   New Architecture: ${hasNewArch ? '✅ Enabled' : '❌ Disabled'}`
    );
    console.log(`   Codegen: ${hasCodegen ? '✅ Enabled' : '❌ Disabled'}`);

    if (!hasNewArch || !hasCodegen) {
      console.log(
        '   ⚠️  Consider enabling newArchEnabled=true and codegenEnabled=true in android/gradle.properties'
      );
    }
  } else {
    console.log('❌ gradle.properties not found');
  }

  // Check settings.gradle
  const settingsGradlePath = path.join(androidDir, 'settings.gradle');
  if (fs.existsSync(settingsGradlePath)) {
    const settingsGradle = fs.readFileSync(settingsGradlePath, 'utf8');
    const hasGradlePlugin = settingsGradle.includes(
      'react-native-gradle-plugin'
    );

    console.log(
      `   React Native Gradle Plugin: ${hasGradlePlugin ? '✅ Configured' : '❌ Not configured'}`
    );

    if (!hasGradlePlugin) {
      console.log(
        '   ⚠️  React Native Gradle Plugin configuration may be missing'
      );
    }
  }

  return true;
}

// Check iOS configuration
function checkIOSSetup() {
  console.log('\n🍎 Checking iOS setup...');

  const iosDir = path.join(process.cwd(), 'ios');
  if (!fs.existsSync(iosDir)) {
    console.log(
      '❌ iOS directory not found. This appears to be an Android-only project.'
    );
    return false;
  }

  // Check Podfile
  const podfilePath = path.join(iosDir, 'Podfile');
  if (fs.existsSync(podfilePath)) {
    console.log('✅ Podfile found');
  } else {
    console.log('❌ Podfile not found');
  }

  // Check if pods are installed
  const podsDir = path.join(iosDir, 'Pods');
  if (fs.existsSync(podsDir)) {
    console.log('✅ Pods directory found (pods may be installed)');
  } else {
    console.log(
      '⚠️  Pods directory not found. Run "cd ios && pod install" if needed.'
    );
  }

  return true;
}

// Check library installation
function checkLibraryInstallation() {
  console.log('\n📦 Checking react-native-biometric-login installation...');

  const nodeModulesPath = path.join(
    process.cwd(),
    'node_modules',
    'react-native-biometric-login'
  );
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ react-native-biometric-login not found in node_modules');
    console.log('   Run: npm install react-native-biometric-login');
    return false;
  }

  console.log('✅ react-native-biometric-login found in node_modules');

  // Check if generated sources exist
  const generatedPath = path.join(
    nodeModulesPath,
    'android',
    'build',
    'generated',
    'source',
    'codegen'
  );
  if (fs.existsSync(generatedPath)) {
    console.log('✅ Generated codegen sources found');

    // Check for Java sources
    const javaPath = path.join(generatedPath, 'java');
    if (fs.existsSync(javaPath)) {
      console.log('   ✅ Java sources found');
    } else {
      console.log('   ⚠️  Java sources missing');
    }

    // Check for JNI sources
    const jniPath = path.join(generatedPath, 'jni');
    if (fs.existsSync(jniPath)) {
      console.log('   ✅ JNI sources found');
    } else {
      console.log('   ⚠️  JNI sources missing');
    }
  } else {
    console.log('❌ Generated codegen sources not found');
    console.log('   Expected location: android/build/generated/source/codegen');
    console.log(
      '   This may cause build errors. Try reinstalling the library.'
    );
  }

  return true;
}

// Main verification
function main() {
  const isRNProject = checkReactNativeProject();
  if (!isRNProject) {
    process.exit(1);
  }

  checkAndroidSetup();
  checkIOSSetup();
  checkLibraryInstallation();

  console.log('\n🎯 Setup verification complete!');
  console.log('\n💡 If you encounter build errors:');
  console.log('   1. Clean and rebuild your project');
  console.log('   2. Check the TROUBLESHOOTING.md file');
  console.log('   3. Ensure React Native Gradle Plugin is properly configured');
  console.log('   4. Verify codegen is enabled in gradle.properties');
}

main();
