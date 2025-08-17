#!/usr/bin/env node

/**
 * Setup Check Script for react-native-biometric-login
 *
 * This script checks if your React Native project is properly configured
 * to use this library. Run it from your project root.
 */

const fs = require('fs');

console.log('🔍 Checking react-native-biometric-login setup...\n');

let hasIssues = false;

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log(
    '❌ No package.json found. Please run this script from your project root.'
  );
  process.exit(1);
}

// Check if the library is installed
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

if (!dependencies['react-native-biometric-login']) {
  console.log('❌ react-native-biometric-login is not installed.');
  console.log('   Run: yarn add react-native-biometric-login');
  hasIssues = true;
} else {
  console.log('✅ react-native-biometric-login is installed');
}

// Check React Native version
if (dependencies['react-native']) {
  const rnVersion = dependencies['react-native'];
  const version = rnVersion.replace(/[^0-9.]/g, '');
  const major = parseInt(version.split('.')[0], 10);
  const minor = parseInt(version.split('.')[1], 10);

  if (major === 0 && minor >= 71) {
    console.log(`✅ React Native version ${version} is compatible`);
  } else {
    console.log(
      `⚠️  React Native version ${version} may have compatibility issues`
    );
    console.log('   Recommended: React Native 0.71.0 or higher');
    hasIssues = true;
  }
} else {
  console.log('❌ React Native is not installed');
  hasIssues = true;
}

// Check Android configuration
if (fs.existsSync('android')) {
  console.log('\n📱 Checking Android configuration...');

  // Check build.gradle
  const buildGradlePath = 'android/build.gradle';
  if (fs.existsSync(buildGradlePath)) {
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    if (buildGradle.includes('react-native-gradle-plugin')) {
      console.log(
        '✅ React Native Gradle Plugin found in android/build.gradle'
      );
    } else {
      console.log(
        '❌ React Native Gradle Plugin not found in android/build.gradle'
      );
      console.log(
        '   Add: classpath "com.facebook.react:react-native-gradle-plugin"'
      );
      hasIssues = true;
    }
  }

  // Check app/build.gradle
  const appBuildGradlePath = 'android/app/build.gradle';
  if (fs.existsSync(appBuildGradlePath)) {
    const appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');
    if (appBuildGradle.includes('codegenEnabled = true')) {
      console.log('✅ Codegen is enabled in android/app/build.gradle');
    } else {
      console.log('❌ Codegen is not enabled in android/app/build.gradle');
      console.log('   Add: codegenEnabled = true in the react block');
      hasIssues = true;
    }

    if (appBuildGradle.includes('apply plugin: "com.facebook.react"')) {
      console.log('✅ React plugin is applied in android/app/build.gradle');
    } else {
      console.log('❌ React plugin is not applied in android/app/build.gradle');
      console.log('   Add: apply plugin: "com.facebook.react"');
      hasIssues = true;
    }
  }

  // Check settings.gradle
  const settingsGradlePath = 'android/settings.gradle';
  if (fs.existsSync(settingsGradlePath)) {
    const settingsGradle = fs.readFileSync(settingsGradlePath, 'utf8');
    if (
      settingsGradle.includes('@react-native/gradle-plugin/settings.gradle')
    ) {
      console.log('✅ React Native Gradle Plugin settings found');
    } else {
      console.log('❌ React Native Gradle Plugin settings not found');
      console.log(
        '   Add: apply from: file("../node_modules/@react-native/gradle-plugin/settings.gradle")'
      );
      hasIssues = true;
    }
  }
} else {
  console.log('\n📱 Android directory not found (iOS-only project?)');
}

// Check iOS configuration
if (fs.existsSync('ios')) {
  console.log('\n🍎 Checking iOS configuration...');

  // Check if Podfile exists
  if (fs.existsSync('ios/Podfile')) {
    console.log('✅ Podfile found');
  } else {
    console.log('❌ Podfile not found');
    hasIssues = true;
  }

  // Check if pods are installed
  if (fs.existsSync('ios/Podfile.lock')) {
    console.log('✅ Podfile.lock found (pods are installed)');
  } else {
    console.log('⚠️  Podfile.lock not found');
    console.log('   Run: cd ios && pod install');
    hasIssues = true;
  }
} else {
  console.log('\n🍎 iOS directory not found (Android-only project?)');
}

// Check for codegen configuration
console.log('\n⚙️  Checking codegen configuration...');
if (packageJson.codegenConfig) {
  console.log('✅ Codegen configuration found in package.json');
} else {
  console.log('⚠️  No codegen configuration found in package.json');
  console.log(
    '   This is usually not required, but you can add it if you have issues'
  );
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasIssues) {
  console.log('❌ Setup has issues that need to be fixed.');
  console.log('   Please check the errors above and refer to:');
  console.log('   📖 [INTEGRATION.md](./INTEGRATION.md)');
  console.log('   🚨 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)');
} else {
  console.log('✅ Setup looks good!');
  console.log('   You should be able to build and run your app.');
}
console.log('='.repeat(50));

if (hasIssues) {
  process.exit(1);
}
